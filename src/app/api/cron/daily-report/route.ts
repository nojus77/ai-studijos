import { NextResponse } from "next/server";

import { buildDailyReport } from "@/lib/reports/daily-report";
import { sendTelegramMessage } from "@/lib/telegram";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Daily analytics digest → Telegram. Scheduled by vercel.json at 05:00 UTC
 * (08:00 Vilnius in summer / 07:00 in winter). Protected by CRON_SECRET when
 * set: Vercel sends `Authorization: Bearer <CRON_SECRET>` on cron invocations.
 * If CRON_SECRET is unset the route still runs (so it works before the secret
 * is configured), just unauthenticated.
 */
export async function GET(request: Request): Promise<Response> {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ?dry=1 renders the report and returns it without sending to Telegram —
  // for previewing/debugging (still behind CRON_SECRET when set).
  const dry = new URL(request.url).searchParams.get("dry") === "1";

  try {
    const text = await buildDailyReport();
    if (dry) return NextResponse.json({ report: text });
    const ok = await sendTelegramMessage(
      text,
      process.env.TELEGRAM_REPORT_CHAT_ID || undefined,
    );
    return NextResponse.json({ ok });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[cron/daily-report] failed", msg);
    // Surface the failure to Telegram so a broken report is visible, not silent.
    await sendTelegramMessage(
      `⚠️ <b>Dienos ataskaita nepavyko</b>\n<code>${msg.slice(0, 300).replace(/</g, "&lt;")}</code>`,
      process.env.TELEGRAM_REPORT_CHAT_ID || undefined,
    ).catch(() => {});
    return NextResponse.json({ error: "report failed" }, { status: 500 });
  }
}
