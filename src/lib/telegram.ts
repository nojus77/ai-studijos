import { type BumpId, type TierSlug } from "@/lib/tiers";

export interface TelegramAdminAlertArgs {
  email: string;
  tier: TierSlug;
  bumps: BumpId[];
  items: { label: string; amount_cents: number }[];
  sessionId: string;
}

// Lead-notification bot + destination. Defaults are baked in so production
// works without depending on Vercel env vars (the deploy account isn't
// reachable from our tooling). Env vars still override if ever set — e.g. to
// rotate the token: regenerate in @BotFather and set TELEGRAM_BOT_TOKEN in
// Vercel, no code change needed. Bot: @aistudijos_bot · Group: "aistudijos leads".
const DEFAULT_BOT_TOKEN = "8907073581:AAGJiShTl6IF6mj1pyJacASW06QL1Q18B7I";
const DEFAULT_CHAT_ID = "-5213881524";

/**
 * Notify the leads chat on every successful purchase. Fails silently if the
 * alert can't be sent — the webhook should never fail a real payment just
 * because the alert pipe is down. Logs the reason so it's debuggable.
 */
export async function sendTelegramAdminAlert(
  args: TelegramAdminAlertArgs,
): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN || DEFAULT_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID || DEFAULT_CHAT_ID;
  if (!token || !chatId) {
    console.warn(
      "[telegram] no bot token or chat id — skipping admin alert",
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
  const total = args.items.reduce((sum, i) => sum + i.amount_cents, 0);
  const itemsList = args.items
    .map(
      (i) =>
        `  • ${escapeHtml(i.label)} — ${(i.amount_cents / 100).toFixed(0)} €`,
    )
    .join("\n");

  return [
    `📧 ${escapeHtml(args.email)}`,
    "",
    `🛒 <b>Ką pirko</b>`,
    itemsList,
    `💰 <b>Iš viso: ${(total / 100).toFixed(0)} €</b>`,
  ].join("\n");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
