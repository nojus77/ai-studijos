import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { env } from "@/lib/env";
import { resend } from "@/lib/resend";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";
import {
  BUMPS,
  getTier,
  isBumpId,
  isTierSlug,
  type BumpId,
  type TierSlug,
} from "@/lib/tiers";

// Stripe webhook signature verification requires the raw request body.
// Do not parse JSON before constructing the event.

interface PurchasedItem {
  id: string;
  label: string;
  amount_cents: number;
}

interface PurchaseSummary {
  tier: TierSlug | null;
  bumps: BumpId[];
  items: PurchasedItem[];
}

export async function POST(request: Request): Promise<Response> {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(
      rawBody,
      signature,
      env.stripeWebhookSecret(),
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid signature";
    console.error("[stripe webhook] signature verification failed", message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(session);
    }
  } catch (error) {
    console.error("[stripe webhook] handler error", error);
    // Return 200 anyway so Stripe doesn't infinitely retry on our internal
    // failures (e.g. Resend down). Failures are logged and visible in logs.
    return NextResponse.json({ received: true, handled: false });
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
): Promise<void> {
  const email =
    session.customer_details?.email ?? session.customer_email ?? null;
  const amountCents = session.amount_total ?? 0;

  if (!email) {
    console.warn(
      "[stripe webhook] checkout.session.completed without email",
      session.id,
    );
  }

  // Resolve full purchase summary (base tier + active bumps + per-item amounts).
  const summary = await resolvePurchaseSummary(session);

  // Persist order — log warning if table missing, do not crash.
  if (email && summary.tier) {
    try {
      const supabase = supabaseAdmin();
      const { error } = await supabase.from("orders").insert({
        stripe_session_id: session.id,
        email,
        tier: summary.tier,
        amount_cents: amountCents,
        items: summary.items,
      });
      if (error) {
        console.warn(
          "[stripe webhook] failed to insert order row",
          error.message,
        );
      }
    } catch (error) {
      console.warn("[stripe webhook] supabase insert threw", error);
    }
  }

  // Send welcome email to customer.
  if (email && summary.tier) {
    try {
      await sendWelcomeEmail({ email, summary });
    } catch (error) {
      console.error("[stripe webhook] welcome email failed", error);
    }
  }

  // Send admin notification — tells Nojus/Simas to manually invite the buyer
  // on Skool (until Skool Pro + Zapier is wired for full automation).
  if (email && summary.tier) {
    try {
      await sendAdminNotification({ email, summary, sessionId: session.id });
    } catch (error) {
      console.error("[stripe webhook] admin notification failed", error);
    }
  }
}

async function resolvePurchaseSummary(
  session: Stripe.Checkout.Session,
): Promise<PurchaseSummary> {
  const tierRaw = session.metadata?.tier;
  const tier: TierSlug | null = isTierSlug(tierRaw) ? tierRaw : null;

  const bumpsMeta = session.metadata?.bumps ?? "";
  const bumps: BumpId[] = bumpsMeta
    .split(",")
    .map((s) => s.trim())
    .filter(isBumpId);

  // Build human-readable items list from metadata (cheap path, no extra API call).
  const items: PurchasedItem[] = [];
  if (tier) {
    const tierInfo = getTier(tier);
    items.push({
      id: tier,
      label: tierInfo.label,
      amount_cents: tierInfo.priceEur * 100,
    });
  }
  for (const bumpId of bumps) {
    const bump = BUMPS[bumpId];
    items.push({
      id: bumpId,
      label: bump.label,
      amount_cents: bump.priceEur * 100,
    });
  }

  // Try to enrich with actual Stripe line_items amounts (overrides defaults on mismatch).
  try {
    const expanded = await stripe().checkout.sessions.retrieve(session.id, {
      expand: ["line_items"],
    });
    const lineItems = expanded.line_items?.data ?? [];
    if (lineItems.length === items.length && lineItems.length > 0) {
      for (let i = 0; i < lineItems.length; i++) {
        const amount = lineItems[i].amount_total;
        if (typeof amount === "number") {
          items[i].amount_cents = amount;
        }
      }
    }
  } catch (error) {
    console.warn("[stripe webhook] expand line_items failed", error);
  }

  return { tier, bumps, items };
}

interface WelcomeEmailArgs {
  email: string;
  summary: PurchaseSummary;
}

async function sendWelcomeEmail({
  email,
  summary,
}: WelcomeEmailArgs): Promise<void> {
  if (!summary.tier) return;

  const tierInfo = getTier(summary.tier);
  const fromEmail = env.resendFromEmail();

  const itemCount = summary.items.length;
  const subject =
    itemCount > 1
      ? `Ačiū už pirkimą — ${tierInfo.shortName} + ${itemCount - 1} priedas`
      : `Ačiū už pirkimą — ${tierInfo.shortName}`;

  const html = buildWelcomeHtml(summary);
  const text = buildWelcomeText(summary);

  await resend().emails.send({
    from: `AI Studijos <${fromEmail}>`,
    to: email,
    subject,
    html,
    text,
  });
}

interface AdminNotificationArgs {
  email: string;
  summary: PurchaseSummary;
  sessionId: string;
}

/**
 * Notify admin (Nojus + Simas) on every successful purchase so they can
 * manually grant Skool classroom access. Replace with Zapier automation
 * once Skool Pro is enabled.
 */
async function sendAdminNotification({
  email,
  summary,
  sessionId,
}: AdminNotificationArgs): Promise<void> {
  if (!summary.tier) return;

  // Comma-separated list of admin recipients via env var (defaults to ai-studijos email).
  const adminTo = (process.env.ADMIN_NOTIFICATION_EMAIL ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (adminTo.length === 0) {
    console.warn(
      "[stripe webhook] ADMIN_NOTIFICATION_EMAIL not set — skipping admin alert",
    );
    return;
  }

  const tierInfo = getTier(summary.tier);
  const fromEmail = env.resendFromEmail();

  // Determine which Skool classrooms to grant based on tier + bumps.
  const classrooms: string[] = [];
  if (
    summary.tier === "kursas" ||
    summary.tier === "standard" ||
    summary.tier === "premium"
  ) {
    if (summary.tier === "kursas") {
      classrooms.push("AI Asistentas: Pilnas Gidas");
    }
    if (
      summary.tier === "standard" ||
      summary.tier === "premium" ||
      summary.bumps.includes("bootcampStandard") ||
      summary.bumps.includes("bootcampPremium")
    ) {
      classrooms.push("AI Studijos Bootcamp");
    }
  }
  if (summary.bumps.includes("aiSpecialists")) {
    classrooms.push("5 AI Specialistai");
  }

  const itemsList = summary.items
    .map(
      (i) =>
        `<li>${escapeHtml(i.label)} — ${(i.amount_cents / 100).toFixed(0)} €</li>`,
    )
    .join("");
  const classroomsList = classrooms
    .map((c) => `<li>${escapeHtml(c)}</li>`)
    .join("");

  const html = wrapHtml(`
    <h1 style="font-size:20px;margin:0 0 12px 0;">🎉 Naujas pirkimas — ${escapeHtml(tierInfo.shortName)}</h1>
    <p><strong>Klientas:</strong> ${escapeHtml(email)}</p>
    <p><strong>Stripe sesija:</strong> <a href="https://dashboard.stripe.com/payments?query=${sessionId}">${sessionId}</a></p>
    <h2 style="font-size:16px;margin:18px 0 6px 0;">Pirkti pasiūlymai</h2>
    <ul style="line-height:1.7;">${itemsList}</ul>
    <h2 style="font-size:16px;margin:18px 0 6px 0;">🎓 Skool — grant access</h2>
    <p>Eik į <a href="https://www.skool.com/ai-studijos-6327/-/about?p=invite">AI Studijos Skool invite</a>, įvesk klientę email <strong>${escapeHtml(email)}</strong> ir suteik prieigą prie šių classroom'ų:</p>
    <ul style="line-height:1.7;">${classroomsList}</ul>
    <p style="color:#666;font-size:12px;">TODO: kai įjungsi Skool Pro + Zapier, šitas notification nebebus reikalingas — automatika perims.</p>
  `);

  await resend().emails.send({
    from: `AI Studijos Webhook <${fromEmail}>`,
    to: adminTo,
    subject: `[Pirkimas] ${tierInfo.shortName} — ${email}`,
    html,
  });
}

function buildWelcomeHtml(summary: PurchaseSummary): string {
  if (!summary.tier) return "";
  const headline = `Ačiū! Tavo užsakymas patvirtintas.`;
  const sections: string[] = [];

  sections.push(buildOrderListHtml(summary));

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
    <h1 style="font-size:22px;margin:0 0 12px 0;">${headline}</h1>
    ${sections.join("\n")}
    <p>Jei turi klausimų — atsakyk į šį laišką arba užpildyk <a href="https://aistudijos.lt/kontaktai">kontaktinę formą</a>.</p>
    <p>Iki,<br/>Nojus · AI Studijos</p>
  `);
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
    <h2 style="font-size:16px;margin:18px 0 6px 0;">AI Bootcamp — kas toliau</h2>
    <p>Tavo vieta rezervuota. Zoom nuorodą bei detalią programą atsiųsime likus <strong>24 valandoms iki pirmos sesijos</strong>.</p>
  `;
}

function buildAiSpecialistsSectionHtml(): string {
  return `
    <h2 style="font-size:16px;margin:18px 0 6px 0;">5 AI Specialistai — kas toliau</h2>
    <p>5 paruoštus Claude įgūdžius (el. paštas, ataskaitos, tyrimai, klientų atsakymai, planavimas) rasi atskirame el. laiške per artimiausias kelias minutes. Pakanka import'uoti vieną kartą — ir veikia.</p>
  `;
}

function buildWelcomeText(summary: PurchaseSummary): string {
  if (!summary.tier) return "";

  const lines: string[] = [
    "Ačiū! Tavo užsakymas patvirtintas.",
    "",
    "Tavo užsakymas:",
    ...summary.items.map(
      (item) => `· ${item.label} — ${(item.amount_cents / 100).toFixed(0)} €`,
    ),
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
      "AI Bootcamp:",
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
    "Klausimai? https://aistudijos.lt/kontaktai",
    "",
    "Iki,",
    "Nojus · AI Studijos",
  );

  return lines.join("\n");
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
