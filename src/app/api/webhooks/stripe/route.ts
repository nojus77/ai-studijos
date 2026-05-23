import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { env } from "@/lib/env";
import { resend } from "@/lib/resend";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";
import { getTier, isTierSlug, type TierSlug } from "@/lib/tiers";

// Stripe webhook signature verification requires the raw request body.
// Do not parse JSON before constructing the event.

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
  const tierRaw = session.metadata?.tier;
  const tier: TierSlug | null = isTierSlug(tierRaw) ? tierRaw : null;
  const amountCents = session.amount_total ?? 0;

  if (!email) {
    console.warn(
      "[stripe webhook] checkout.session.completed without email",
      session.id,
    );
  }

  // Persist order — log warning if table missing, do not crash.
  if (email && tier) {
    try {
      const supabase = supabaseAdmin();
      const { error } = await supabase.from("orders").insert({
        stripe_session_id: session.id,
        email,
        tier,
        amount_cents: amountCents,
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

  // Send welcome email.
  if (email && tier) {
    try {
      await sendWelcomeEmail({ email, tier });
    } catch (error) {
      console.error("[stripe webhook] welcome email failed", error);
    }
  }
}

interface WelcomeEmailArgs {
  email: string;
  tier: TierSlug;
}

async function sendWelcomeEmail({
  email,
  tier,
}: WelcomeEmailArgs): Promise<void> {
  const tierInfo = getTier(tier);
  const fromEmail = env.resendFromEmail();

  const subject = `Ačiū už pirkimą — ${tierInfo.shortName}`;
  const html = buildWelcomeHtml(tier);
  const text = buildWelcomeText(tier);

  await resend().emails.send({
    from: `AI Studijos <${fromEmail}>`,
    to: email,
    subject,
    html,
    text,
  });
}

function buildWelcomeHtml(tier: TierSlug): string {
  const tierInfo = getTier(tier);
  const skoolUrl = optionalUrl(() => env.skoolInviteUrl());

  const headline = `Ačiū! Tavo užsakymas patvirtintas.`;

  if (tier === "kursas") {
    const videoUrl = safeUrl(() => env.kursasVideoUrl());
    const pdfUrl = safeUrl(() => env.kursasPdfUrl());
    return wrapHtml(`
      <h1 style="font-size:22px;margin:0 0 12px 0;">${headline}</h1>
      <p>Sveiki, gavai prieigą prie <strong>${escapeHtml(tierInfo.label)}</strong>.</p>
      <p>Žemiau — visos tavo nuorodos. Išsaugok šį laišką, jis tau bus reikalingas.</p>
      <ul style="line-height:1.7;">
        <li><a href="${videoUrl}">Žiūrėti video kursą</a></li>
        <li><a href="${pdfUrl}">Atsisiųsti PDF gidą</a></li>
        ${skoolUrl ? `<li><a href="${skoolUrl}">Prisijungti prie Skool bendruomenės</a></li>` : ""}
      </ul>
      <p>Jei turi klausimų — atsakyk į šį laišką arba rašyk <a href="mailto:labas@aistudijos.lt">labas@aistudijos.lt</a>.</p>
      <p>Iki,<br/>Nojus · AI Studijos</p>
    `);
  }

  // Bootcamp tiers
  return wrapHtml(`
    <h1 style="font-size:22px;margin:0 0 12px 0;">${headline}</h1>
    <p>Tavo vieta <strong>${escapeHtml(tierInfo.label)}</strong> rezervuota.</p>
    <p>Zoom nuorodą bei detalią programą atsiųsime el. paštu likus <strong>24 valandoms iki pirmos sesijos</strong>.</p>
    ${skoolUrl ? `<p>Tuo tarpu prisijunk prie bendruomenės: <a href="${skoolUrl}">AI Studijos Skool</a>.</p>` : ""}
    <p>Jei turi klausimų — atsakyk į šį laišką arba rašyk <a href="mailto:labas@aistudijos.lt">labas@aistudijos.lt</a>.</p>
    <p>Iki susitikimo,<br/>Nojus · AI Studijos</p>
  `);
}

function buildWelcomeText(tier: TierSlug): string {
  const tierInfo = getTier(tier);
  const skoolUrl = optionalUrl(() => env.skoolInviteUrl());

  if (tier === "kursas") {
    const videoUrl = safeUrl(() => env.kursasVideoUrl());
    const pdfUrl = safeUrl(() => env.kursasPdfUrl());
    return [
      "Ačiū! Tavo užsakymas patvirtintas.",
      "",
      `Gavai prieigą prie: ${tierInfo.label}.`,
      "",
      `Video kursas: ${videoUrl}`,
      `PDF gidas: ${pdfUrl}`,
      skoolUrl ? `Skool bendruomenė: ${skoolUrl}` : "",
      "",
      "Klausimai? labas@aistudijos.lt",
      "",
      "Iki,",
      "Nojus · AI Studijos",
    ]
      .filter(Boolean)
      .join("\n");
  }

  return [
    "Ačiū! Tavo užsakymas patvirtintas.",
    "",
    `Tavo vieta ${tierInfo.label} rezervuota.`,
    "Zoom nuorodą atsiųsime likus 24 val. iki pirmos sesijos.",
    skoolUrl ? `Bendruomenė: ${skoolUrl}` : "",
    "",
    "Klausimai? labas@aistudijos.lt",
    "",
    "Iki susitikimo,",
    "Nojus · AI Studijos",
  ]
    .filter(Boolean)
    .join("\n");
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
