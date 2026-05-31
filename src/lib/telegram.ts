import { getTier, type BumpId, type TierSlug } from "@/lib/tiers";

export interface TelegramAdminAlertArgs {
  email: string;
  tier: TierSlug;
  bumps: BumpId[];
  items: { label: string; amount_cents: number }[];
  sessionId: string;
}

/**
 * Notify the admin chat on every successful purchase. Fails silently when
 * env vars are missing — the webhook should never fail a real payment just
 * because the alert pipe is down. Logs the reason so it's debuggable.
 */
export async function sendTelegramAdminAlert(
  args: TelegramAdminAlertArgs,
): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  if (!token || !chatId) {
    console.warn(
      "[telegram] TELEGRAM_BOT_TOKEN or TELEGRAM_ADMIN_CHAT_ID not set — skipping admin alert",
    );
    return;
  }

  const text = buildAlertText(args);

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    },
  );

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    console.error(
      "[telegram] sendMessage failed",
      response.status,
      body.slice(0, 300),
    );
  }
}

function buildAlertText(args: TelegramAdminAlertArgs): string {
  const tierInfo = getTier(args.tier);

  const total = args.items.reduce((sum, i) => sum + i.amount_cents, 0);
  const itemsList = args.items
    .map(
      (i) =>
        `  • ${escapeHtml(i.label)} — ${(i.amount_cents / 100).toFixed(0)} €`,
    )
    .join("\n");

  // Compute which Skool classrooms this purchase grants — matches the
  // catalog rules in the webhook.
  const classrooms: string[] = [];
  if (args.tier === "kursas") {
    classrooms.push("AI Asistentas: Pilnas Gidas");
  }
  if (
    args.tier === "standard" ||
    args.tier === "premium" ||
    args.bumps.includes("bootcampStandard") ||
    args.bumps.includes("bootcampPremium")
  ) {
    classrooms.push("AI Studijos Bootcamp");
  }
  if (args.bumps.includes("aiSpecialists")) {
    classrooms.push("5 AI Specialistai");
  }
  const classroomsList = classrooms.length
    ? classrooms.map((c) => `  • ${escapeHtml(c)}`).join("\n")
    : "  (nėra)";

  const skoolInviteUrl =
    "https://www.skool.com/ai-studijos-6327/-/about?p=invite";
  const stripeUrl = `https://dashboard.stripe.com/payments?query=${encodeURIComponent(args.sessionId)}`;

  return [
    `🎉 <b>Naujas pirkimas — ${escapeHtml(tierInfo.shortName)}</b>`,
    "",
    `📧 <b>${escapeHtml(args.email)}</b>`,
    `💰 ${(total / 100).toFixed(0)} €`,
    "",
    `🛒 <b>Pirkti pasiūlymai</b>`,
    itemsList,
    "",
    `🎓 <b>Skool — grant access</b>`,
    classroomsList,
    "",
    `👉 <a href="${skoolInviteUrl}">Pridėti į Skool</a>`,
    `👉 <a href="${stripeUrl}">Peržiūrėti Stripe sesiją</a>`,
  ].join("\n");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
