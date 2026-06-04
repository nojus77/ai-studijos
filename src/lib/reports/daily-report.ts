import {
  fetchClarityInsights,
  sessionsForPath,
  summarizeByDimension,
  summarizeEngagement,
  summarizeTraffic,
} from "@/lib/clarity";
import { stripe } from "@/lib/stripe";
import { getTier, isTierSlug } from "@/lib/tiers";

interface Sale {
  amountCents: number;
  label: string;
  created: number; // unix seconds
}

const eur = (cents: number): string => `${(cents / 100).toFixed(0)} €`;

const pct = (part: number, whole: number): string =>
  whole > 0 ? `${((part / whole) * 100).toFixed(1)} %` : "—";

const fmtSec = (sec?: number): string => {
  if (!sec || sec <= 0) return "—";
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return m > 0 ? `${m} min ${s} s` : `${s} s`;
};

const delta = (today: number, prev: number): string => {
  if (prev === 0) return today > 0 ? " (naujas)" : "";
  const d = Math.round(((today - prev) / prev) * 100);
  const arrow = d > 0 ? "▲" : d < 0 ? "▼" : "▬";
  return ` (${arrow} ${d > 0 ? "+" : ""}${d}% vs vakar)`;
};

const esc = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Paid checkout sessions since `sinceUnix` (seconds). Stripe is the
 *  conversions source of truth — independent of whether Supabase is wired. */
async function listPaidSales(sinceUnix: number): Promise<Sale[]> {
  const sessions = await stripe()
    .checkout.sessions.list({ created: { gte: sinceUnix }, limit: 100 })
    .autoPagingToArray({ limit: 1000 });

  return sessions
    .filter((s) => s.payment_status === "paid")
    .map((s) => {
      const tier = s.metadata?.tier;
      const label =
        s.metadata?.tier_label ||
        (tier && isTierSlug(tier) ? getTier(tier).shortName : tier) ||
        "Pirkimas";
      return { amountCents: s.amount_total ?? 0, label, created: s.created };
    });
}

/**
 * Daily Telegram report led by the checkout funnel (landing → checkout →
 * purchase, with drop-offs), then behaviour (active time, scroll), traffic
 * sources, and a rolling 7-day conversions summary. Conversions come from
 * Stripe (always available); traffic/behaviour from Clarity (when
 * CLARITY_API_TOKEN is set — otherwise that section degrades to Stripe-only).
 */
export async function buildDailyReport(
  now: Date = new Date(),
): Promise<string> {
  const nowUnix = Math.floor(now.getTime() / 1000);
  const sec24 = 24 * 3600;

  // ── Conversions (Stripe) ──
  const week = await listPaidSales(nowUnix - 7 * 24 * 3600);
  const in24 = week.filter((s) => s.created >= nowUnix - sec24);
  const prev24 = week.filter(
    (s) => s.created >= nowUnix - 2 * sec24 && s.created < nowUnix - sec24,
  );
  const purchases = in24.length;

  const rev = (rows: Sale[]): number =>
    rows.reduce((s, o) => s + (o.amountCents || 0), 0);
  const byProduct = (rows: Sale[]): string => {
    const map = new Map<string, number>();
    for (const s of rows) map.set(s.label, (map.get(s.label) ?? 0) + 1);
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([l, c]) => `${esc(l)} ×${c}`)
      .join(" · ");
  };

  // ── Traffic / behaviour / funnel (Clarity, 24h) ──
  const overall = await fetchClarityInsights(1);
  const bySource = await fetchClarityInsights(1, ["Source"]);
  const byUrl = await fetchClarityInsights(1, ["URL"]);
  const clarityOn = overall != null;

  const traffic = overall ? summarizeTraffic(overall) : null;
  const eng = overall ? summarizeEngagement(overall) : null;
  const sources = bySource
    ? summarizeByDimension(bySource, "Source").slice(0, 4)
    : [];
  const urlCounts = byUrl ? summarizeByDimension(byUrl, "URL") : [];
  const humanSessions = traffic
    ? Math.max(0, traffic.sessions - traffic.botSessions)
    : 0;

  const landing =
    sessionsForPath(urlCounts, (p) => p === "/" || p === "") || humanSessions;
  const checkoutReached = sessionsForPath(urlCounts, (p) =>
    p.includes("/checkout"),
  );

  // ── Compose ──
  const dateStr = now.toLocaleDateString("lt-LT", {
    timeZone: "Europe/Vilnius",
  });
  const timeStr = now.toLocaleTimeString("lt-LT", {
    timeZone: "Europe/Vilnius",
    hour: "2-digit",
    minute: "2-digit",
  });

  const lines: string[] = [
    `📊 <b>AI Studijos — dienos ataskaita</b>`,
    `📅 ${dateStr} · ${timeStr} (Vilnius) · paskutinės 24 h`,
    "",
    `🎯 <b>FUNNELIS (24 h)</b>`,
  ];

  if (clarityOn && landing > 0) {
    lines.push(`👁 Landing: <b>${landing}</b> sesijos`);
    lines.push(
      `🛒 Pasiekė checkout: <b>${checkoutReached}</b> (${pct(checkoutReached, landing)} iš landing)`,
    );
    const fromCheckout =
      checkoutReached > 0
        ? ` · ${pct(purchases, checkoutReached)} iš checkout`
        : "";
    lines.push(
      `💳 Pirkimai: <b>${purchases}</b>${delta(purchases, prev24.length)} — ${pct(purchases, landing)} iš landing${fromCheckout}`,
    );
  } else {
    lines.push(
      `💳 Pirkimai: <b>${purchases}</b>${delta(purchases, prev24.length)}`,
    );
  }
  lines.push(
    `💰 Pajamos: <b>${eur(rev(in24))}</b>${delta(rev(in24), rev(prev24))}`,
  );
  if (purchases) lines.push(`📦 Produktai: ${byProduct(in24)}`);
  lines.push("");

  if (clarityOn && traffic) {
    lines.push(`⏱ <b>Elgesys (24 h · Clarity)</b>`);
    const timeLine =
      eng?.activeTimeSec && eng?.totalTimeSec
        ? `${fmtSec(eng.activeTimeSec)} (iš ${fmtSec(eng.totalTimeSec)} viso)`
        : fmtSec(eng?.activeTimeSec ?? eng?.totalTimeSec);
    lines.push(`• Aktyvus laikas: <b>${timeLine}</b>`);
    if (eng?.scrollDepthPct)
      lines.push(`• Scroll gylis: <b>${eng.scrollDepthPct.toFixed(0)} %</b>`);
    lines.push(
      `• Sesijos: ${traffic.sessions} (žmonės: ${humanSessions} · botai: ${pct(traffic.botSessions, traffic.sessions)})`,
    );
    if (sources.length)
      lines.push(
        `• Top šaltiniai: ${sources.map((s) => `${esc(s.name)} (${s.sessions})`).join(" · ")}`,
      );
    lines.push("");
  } else {
    lines.push(
      `⏱ <b>Clarity:</b> dar neprijungta — nustatyk <code>CLARITY_API_TOKEN</code> Vercel env (Clarity → Settings → Data Export), ir funnelis + laikas + scroll + šaltiniai atsiras.`,
    );
    lines.push("");
  }

  // 7-day summary — every day
  lines.push(`🗓️ <b>Savaitės suvestinė (7 d.)</b>`);
  lines.push(
    `• Pirkimai: <b>${week.length}</b> · Pajamos: <b>${eur(rev(week))}</b>`,
  );
  if (week.length) lines.push(`• Pagal produktą: ${byProduct(week)}`);
  lines.push("");

  const insights = buildInsights({
    purchases,
    prevPurchases: prev24.length,
    landing: clarityOn ? landing : 0,
    checkoutReached: clarityOn ? checkoutReached : 0,
    topSource: sources[0],
  });
  if (insights.length) {
    lines.push(`📈 <b>Įžvalgos</b>`);
    insights.forEach((i) => lines.push(`• ${i}`));
  }

  return lines.join("\n");
}

function buildInsights(args: {
  purchases: number;
  prevPurchases: number;
  landing: number;
  checkoutReached: number;
  topSource?: { name: string; sessions: number };
}): string[] {
  const out: string[] = [];

  // Funnel leak — reached checkout but nobody bought.
  if (args.checkoutReached >= 3 && args.purchases === 0)
    out.push(
      `🔴 ${args.checkoutReached} pasiekė checkout, bet 0 pirkimų — checkout puslapyje kažkas stabdo (kaina? mokėjimas?).`,
    );
  // Traffic but almost nobody reaches checkout.
  else if (args.landing >= 20 && args.checkoutReached <= 1)
    out.push(
      `🟡 ${args.landing} landing sesijų, bet tik ${args.checkoutReached} pasiekė checkout — landinge silpnas CTA / pasiūlymas.`,
    );

  if (args.purchases > args.prevPurchases)
    out.push(
      `🟢 Konversijos kyla — ${args.prevPurchases} → ${args.purchases} pirkimai.`,
    );
  else if (args.purchases < args.prevPurchases)
    out.push(
      `🔴 Konversijos krito — ${args.prevPurchases} → ${args.purchases} pirkimai.`,
    );

  if (args.topSource && args.topSource.sessions > 0)
    out.push(
      `Daugiausiai srauto: ${esc(args.topSource.name)} (${args.topSource.sessions} sesijos).`,
    );

  return out;
}
