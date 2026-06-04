import {
  fetchClarityInsights,
  summarizeByDimension,
  summarizeEngagement,
  summarizePopularPages,
  summarizeTraffic,
} from "@/lib/clarity";
import { stripe } from "@/lib/stripe";
import { getTier, isTierSlug } from "@/lib/tiers";

const H = 3_600_000;

interface Sale {
  amountCents: number;
  label: string;
  created: number; // unix seconds
}

const eur = (cents: number): string => `${(cents / 100).toFixed(0)} €`;

const pct = (part: number, whole: number): string =>
  whole > 0 ? `${((part / whole) * 100).toFixed(1)} %` : "—";

const fmtTime = (sec?: number): string => {
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

const shortUrl = (u: string): string => {
  try {
    return new URL(u).pathname || "/";
  } catch {
    return u;
  }
};

/** Paid checkout sessions since `sinceUnix` (seconds), newest first. Stripe is
 *  the conversions source of truth — independent of whether Supabase is wired. */
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
 * Builds the daily Telegram report: 24h conversions (from Stripe) + 24h
 * traffic/engagement (from Clarity, if a token is configured) + a derived
 * conversion rate, plus a rolling 7-day conversions summary every day. Throws
 * on a hard Stripe failure so the cron surfaces it; Clarity being unavailable
 * is a soft degrade (conversions still send).
 */
export async function buildDailyReport(
  now: Date = new Date(),
): Promise<string> {
  const t = now.getTime();
  const nowUnix = Math.floor(t / 1000);
  const sec24 = 24 * 3600;

  // ── Conversions (Stripe) ──
  const week = await listPaidSales(nowUnix - 7 * 24 * 3600);
  const in24 = week.filter((s) => s.created >= nowUnix - sec24);
  const prev24 = week.filter(
    (s) => s.created >= nowUnix - 2 * sec24 && s.created < nowUnix - sec24,
  );

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

  // ── Traffic / engagement (Clarity, 24h) ──
  const overall = await fetchClarityInsights(1);
  const bySource = await fetchClarityInsights(1, ["Source"]);
  const clarityOn = overall != null;
  const traffic = overall ? summarizeTraffic(overall) : null;
  const eng = overall ? summarizeEngagement(overall) : null;
  const pages = overall ? summarizePopularPages(overall).slice(0, 4) : [];
  const sources = bySource
    ? summarizeByDimension(bySource, "Source").slice(0, 4)
    : [];
  const humanSessions = traffic
    ? Math.max(0, traffic.sessions - traffic.botSessions)
    : 0;

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
    `💰 <b>Konversijos (24 h)</b>`,
    `• Pirkimai: <b>${in24.length}</b>${delta(in24.length, prev24.length)}`,
    `• Pajamos: <b>${eur(rev(in24))}</b>${delta(rev(in24), rev(prev24))}`,
  ];
  if (in24.length) lines.push(`• Pagal produktą: ${byProduct(in24)}`);
  if (clarityOn && humanSessions > 0) {
    lines.push(
      `• Konversija: ${in24.length} / ${humanSessions} sesijų = <b>${pct(in24.length, humanSessions)}</b>`,
    );
  }
  lines.push("");

  if (clarityOn && traffic) {
    lines.push(`👀 <b>Srautas ir elgesys (24 h · Clarity)</b>`);
    lines.push(
      `• Sesijos: <b>${traffic.sessions}</b> (žmonės: ${humanSessions} · botai: ${pct(traffic.botSessions, traffic.sessions)})`,
    );
    if (traffic.users) lines.push(`• Unikalūs naudotojai: ${traffic.users}`);
    if (eng?.avgTimeSec)
      lines.push(`• Vid. laikas sayte: ${fmtTime(eng.avgTimeSec)}`);
    if (eng?.scrollDepthPct)
      lines.push(`• Vid. scroll gylis: ${eng.scrollDepthPct.toFixed(0)} %`);
    if (pages.length)
      lines.push(
        `• Top puslapiai: ${pages.map((p) => `${esc(shortUrl(p.name))} (${p.sessions})`).join(" · ")}`,
      );
    if (sources.length)
      lines.push(
        `• Top šaltiniai: ${sources.map((s) => `${esc(s.name)} (${s.sessions})`).join(" · ")}`,
      );
    lines.push("");
  } else {
    lines.push(
      `👀 <b>Clarity:</b> dar neprijungta — nustatyk <code>CLARITY_API_TOKEN</code> Vercel env, ir srauto metrikos atsiras. Konversijos rodomos iš Stripe.`,
    );
    lines.push("");
  }

  // 7-day summary — shown every day alongside the 24h section
  lines.push(`🗓️ <b>Savaitės suvestinė (7 d.)</b>`);
  lines.push(
    `• Pirkimai: <b>${week.length}</b> · Pajamos: <b>${eur(rev(week))}</b>`,
  );
  if (week.length) lines.push(`• Pagal produktą: ${byProduct(week)}`);
  lines.push(
    `<i>(Clarity srauto suvestinę riboja 3 d. API limitas — rodoma tik 24 h.)</i>`,
  );
  lines.push("");

  // Rule-based insights
  const insights = buildInsights({
    today: in24.length,
    prev: prev24.length,
    humanSessions,
    clarityOn,
    topSource: sources[0],
  });
  if (insights.length) {
    lines.push(`📈 <b>Įžvalgos</b>`);
    insights.forEach((i) => lines.push(`• ${i}`));
  }

  return lines.join("\n");
}

function buildInsights(args: {
  today: number;
  prev: number;
  humanSessions: number;
  clarityOn: boolean;
  topSource?: { name: string; sessions: number };
}): string[] {
  const out: string[] = [];
  if (args.today > args.prev)
    out.push(`🟢 Konversijos kyla — ${args.prev} → ${args.today} pirkimai.`);
  else if (args.today < args.prev)
    out.push(`🔴 Konversijos krito — ${args.prev} → ${args.today} pirkimai.`);

  if (args.clarityOn && args.humanSessions >= 20 && args.today === 0)
    out.push(
      `🟡 ${args.humanSessions} sesijų, bet 0 pirkimų per 24 h — patikrink funnelį / kainą.`,
    );

  if (args.topSource && args.topSource.sessions > 0)
    out.push(
      `Daugiausiai srauto: ${esc(args.topSource.name)} (${args.topSource.sessions} sesijos).`,
    );

  return out;
}
