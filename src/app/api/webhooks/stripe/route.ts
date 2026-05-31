import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";
import { sendTelegramAdminAlert } from "@/lib/telegram";
import {
  BUMPS,
  getTier,
  isBumpId,
  isTierSlug,
  type BumpId,
  type TierSlug,
} from "@/lib/tiers";
import {
  sendWelcomeEmail,
  type PurchaseSummary,
  type PurchasedItem,
} from "@/lib/welcome-email";

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

  // Notify admin via Telegram — replaces the previous Resend admin email.
  // Cheaper, fewer steps to act on (link is right there in the message).
  if (email && summary.tier) {
    try {
      await sendTelegramAdminAlert({
        email,
        tier: summary.tier,
        bumps: summary.bumps,
        items: summary.items,
        sessionId: session.id,
      });
    } catch (error) {
      console.error("[stripe webhook] telegram alert failed", error);
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
