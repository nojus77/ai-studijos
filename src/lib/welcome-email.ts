import { env } from "@/lib/env";
import { resend } from "@/lib/resend";
import { BUMPS, getTier, type BumpId, type TierSlug } from "@/lib/tiers";

export interface PurchasedItem {
  id: string;
  label: string;
  amount_cents: number;
}

export interface PurchaseSummary {
  tier: TierSlug | null;
  bumps: BumpId[];
  items: PurchasedItem[];
}

/** Build a PurchaseSummary from a tier + bump list using the default
 *  catalog prices. Used by the test script; the webhook builds the
 *  same shape from real Stripe line items. */
export function buildSummary(
  tier: TierSlug,
  bumps: BumpId[] = [],
): PurchaseSummary {
  const tierInfo = getTier(tier);
  const items: PurchasedItem[] = [
    {
      id: tier,
      label: tierInfo.label,
      amount_cents: tierInfo.priceEur * 100,
    },
  ];
  for (const bumpId of bumps) {
    const bump = BUMPS[bumpId];
    items.push({
      id: bumpId,
      label: bump.label,
      amount_cents: bump.priceEur * 100,
    });
  }
  return { tier, bumps, items };
}

interface SendWelcomeEmailArgs {
  email: string;
  summary: PurchaseSummary;
}

export async function sendWelcomeEmail({
  email,
  summary,
}: SendWelcomeEmailArgs): Promise<void> {
  if (!summary.tier) return;

  const tierInfo = getTier(summary.tier);
  const fromEmail = env.resendFromEmail();

  const itemCount = summary.items.length;
  const subject =
    itemCount > 1
      ? `Džiaugiamės, kad nusipirkai — ${tierInfo.shortName} + ${itemCount - 1} priedas`
      : `Džiaugiamės, kad nusipirkai — ${tierInfo.shortName}`;

  // Resend's SDK returns { data, error } and DOES NOT throw on API errors.
  // We have to surface the error ourselves — otherwise a 403 (unverified
  // domain, expired key, rate limit, …) just silently swallows the welcome
  // email, the webhook returns 200, and the buyer thinks the system is
  // broken. Throw so the webhook's try/catch logs the real reason.
  const { error } = await resend().emails.send({
    from: `AI Studijos <${fromEmail}>`,
    to: email,
    subject,
    html: buildWelcomeHtml(summary),
    text: buildWelcomeText(summary),
  });
  if (error) {
    throw new Error(
      `Resend send failed: ${error.name} (${error.message ?? "no message"})`,
    );
  }
}

export function buildWelcomeHtml(summary: PurchaseSummary): string {
  if (!summary.tier) return "";
  const headline = `Džiaugiamės, kad nusipirkai!`;
  const sections: string[] = [];

  sections.push(buildOrderListHtml(summary));
  sections.push(
    `<p style="font-size:15px;line-height:1.6;">Per valandą laiko gausi prieigą prie visų mokymų bei uždaros mūsų bendruomenės.</p>`,
  );

  if (summary.tier === "kursas") {
    sections.push(buildKursasSectionHtml());
  }
  if (
    summary.tier === "standard" ||
    summary.tier === "premium" ||
    summary.bumps.includes("bootcampStandard") ||
    summary.bumps.includes("bootcampPremium")
  ) {
    sections.push(buildBootcampSectionHtml());
  }
  if (summary.bumps.includes("aiSpecialists")) {
    sections.push(buildAiSpecialistsSectionHtml());
  }

  const skoolUrl = optionalUrl(() => env.skoolInviteUrl());
  if (skoolUrl) {
    sections.push(`
      <h2 style="font-size:16px;margin:18px 0 6px 0;">🎓 Skool prieiga prie pirkto turinio</h2>
      <p>Per artimiausias <strong>1-2 valandas (darbo dienomis)</strong> gausi atskirą Skool kvietimą su tiesiogine prieiga prie pirkto classroom'o — be jokio papildomo mokėjimo Skool platformoje.</p>
      <p>Kol lauki, gali apsilankyti bendruomenėje: <a href="${skoolUrl}">AI Studijos Skool</a>.</p>
    `);
  }

  return wrapHtml(`
    <div style="text-align:center;margin:0 0 20px 0;">
      <img src="https://aistudijos.lt/email-logo.png" alt="AI Studijos" width="64" height="64" style="display:inline-block;width:64px;height:64px;" />
    </div>
    <h1 style="font-size:22px;margin:0 0 12px 0;">${headline}</h1>
    ${sections.join("\n")}
    <p>Iki,<br/>Nojus · AI Studijos</p>
  `);
}

export function buildWelcomeText(summary: PurchaseSummary): string {
  if (!summary.tier) return "";

  const lines: string[] = [
    "Džiaugiamės, kad nusipirkai!",
    "",
    "Tavo užsakymas:",
    ...summary.items.map(
      (item) => `· ${item.label} — ${(item.amount_cents / 100).toFixed(0)} €`,
    ),
    "",
    "Per valandą laiko gausi prieigą prie visų mokymų bei uždaros mūsų bendruomenės.",
    "",
  ];

  if (summary.tier === "kursas") {
    const videoUrl = safeUrl(() => env.kursasVideoUrl());
    const pdfUrl = safeUrl(() => env.kursasPdfUrl());
    lines.push(
      "AI Asistento gidas — tavo prieiga:",
      `Video kursas: ${videoUrl}`,
      `PDF gidas: ${pdfUrl}`,
      "",
    );
  }

  if (
    summary.tier === "standard" ||
    summary.tier === "premium" ||
    summary.bumps.includes("bootcampStandard") ||
    summary.bumps.includes("bootcampPremium")
  ) {
    lines.push(
      "AI Dirbtuvės:",
      "Zoom nuorodą atsiųsime likus 24 val. iki pirmos sesijos.",
      "",
    );
  }

  if (summary.bumps.includes("aiSpecialists")) {
    lines.push(
      "5 AI Specialistai:",
      "Paruoštus įgūdžius rasi atskirame el. laiške per kelias minutes.",
      "",
    );
  }

  const skoolUrl = optionalUrl(() => env.skoolInviteUrl());
  if (skoolUrl) {
    lines.push(`Bendruomenė: ${skoolUrl}`, "");
  }

  lines.push(
    "Iki,",
    "Nojus · AI Studijos",
  );

  return lines.join("\n");
}

function buildOrderListHtml(summary: PurchaseSummary): string {
  const lis = summary.items
    .map(
      (item) =>
        `<li><strong>${escapeHtml(item.label)}</strong> — ${(item.amount_cents / 100).toFixed(0)} €</li>`,
    )
    .join("");
  return `<p>Tavo užsakymas:</p><ul style="line-height:1.7;">${lis}</ul>`;
}

function buildKursasSectionHtml(): string {
  const videoUrl = safeUrl(() => env.kursasVideoUrl());
  const pdfUrl = safeUrl(() => env.kursasPdfUrl());
  return `
    <h2 style="font-size:16px;margin:18px 0 6px 0;">AI Asistento gidas — tavo prieiga</h2>
    <ul style="line-height:1.7;">
      <li><a href="${videoUrl}">Žiūrėti video kursą</a></li>
      <li><a href="${pdfUrl}">Atsisiųsti PDF gidą</a></li>
    </ul>
  `;
}

function buildBootcampSectionHtml(): string {
  return `
    <h2 style="font-size:16px;margin:18px 0 6px 0;">AI Dirbtuvės — kas toliau</h2>
    <p>Tavo vieta rezervuota. Zoom nuorodą bei detalią programą atsiųsime likus <strong>24 valandoms iki pirmos sesijos</strong>.</p>
  `;
}

function buildAiSpecialistsSectionHtml(): string {
  return `
    <h2 style="font-size:16px;margin:18px 0 6px 0;">5 AI Specialistai — kas toliau</h2>
    <p>5 paruoštus Claude įgūdžius (el. paštas, ataskaitos, tyrimai, klientų atsakymai, planavimas) rasi atskirame el. laiške per artimiausias kelias minutes. Pakanka import'uoti vieną kartą — ir veikia.</p>
  `;
}

function wrapHtml(inner: string): string {
  return `<!doctype html><html lang="lt"><body style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;color:#111;line-height:1.55;max-width:560px;margin:0 auto;padding:24px;">${inner}</body></html>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function safeUrl(getter: () => string): string {
  try {
    return getter();
  } catch {
    return "#";
  }
}

function optionalUrl(getter: () => string | undefined): string | undefined {
  try {
    return getter();
  } catch {
    return undefined;
  }
}
