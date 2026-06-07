import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { z } from "zod";

import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { sendTelegramMessage } from "@/lib/telegram";
import {
  BUMPS,
  getBump,
  getStripePriceId,
  getTier,
  type BumpId,
} from "@/lib/tiers";

// Stripe coupon that drops the base guide 47 € → 26 € (−21 €). Applied when a
// visitor unlocks the email-gated discount on the checkout page.
const EMAIL_DISCOUNT_COUPON = "gmail21off";

const escapeHtml = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const bodySchema = z.object({
  baseTier: z.enum(["kursas", "standard", "premium"]),
  bumps: z
    .object({
      bootcamp: z.enum(["standard", "premium"]).nullable().optional(),
      aiSpecialists: z.boolean().optional(),
    })
    .default({}),
  discount: z.boolean().optional(),
  email: z.string().email().optional(),
});

export async function POST(request: Request): Promise<Response> {
  try {
    const json = await request.json().catch(() => null);
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Neteisingi užsakymo duomenys" },
        { status: 400 },
      );
    }

    const { baseTier, bumps, discount, email } = parsed.data;
    const tierInfo = getTier(baseTier);

    // Resolve which bumps are active.
    const activeBumpIds: BumpId[] = [];
    if (baseTier === "kursas" && bumps.bootcamp) {
      if (bumps.bootcamp === "standard") activeBumpIds.push("bootcampStandard");
      else if (bumps.bootcamp === "premium")
        activeBumpIds.push("bootcampPremium");
    }
    if (bumps.aiSpecialists) activeBumpIds.push("aiSpecialists");

    // Build line items.
    type LineItem = NonNullable<
      Stripe.Checkout.SessionCreateParams["line_items"]
    >[number];
    const lineItems: LineItem[] = [
      { price: getStripePriceId(baseTier), quantity: 1 },
    ];
    for (const bumpId of activeBumpIds) {
      lineItems.push({ price: getBump(bumpId).getPriceId(), quantity: 1 });
    }

    const bumpsMeta = activeBumpIds.join(",");
    const bumpsLabelsMeta = activeBumpIds
      .map((id) => BUMPS[id].label)
      .join(" + ");

    // The email-gated coupon and Stripe's own promo-code field are mutually
    // exclusive. Apply the coupon when the visitor unlocked it (base guide
    // only); otherwise let them type a promo code.
    const applyDiscount = Boolean(discount) && baseTier === "kursas";
    const discountFields: Pick<
      Stripe.Checkout.SessionCreateParams,
      "discounts" | "allow_promotion_codes"
    > = applyDiscount
      ? { discounts: [{ coupon: EMAIL_DISCOUNT_COUPON }] }
      : { allow_promotion_codes: true };

    const session = await stripe().checkout.sessions.create({
      ui_mode: "embedded_page",
      mode: "payment",
      // Omitting payment_method_types makes Stripe auto-include every method
      // enabled in the dashboard (card + Revolut Pay + Apple/Google Pay + Link etc.)
      line_items: lineItems,
      return_url: `${env.siteUrl}/aciu?session_id={CHECKOUT_SESSION_ID}`,
      locale: "lt",
      ...discountFields,
      ...(email ? { customer_email: email } : {}),
      // VAT / PVM collection — buyers can enter LT or any EU VAT id, used to
      // generate a proper PVM saskaita-faktura via Stripe invoice automation
      tax_id_collection: { enabled: true },
      customer_creation: "always",
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description: tierInfo.label,
          metadata: { tier: baseTier, bumps: bumpsMeta },
          footer:
            "Sąskaita-faktūra automatiškai sugeneruota Stripe. Jei reikia keisti — atsakyk į patvirtinimo el. laišką.",
        },
      },
      metadata: {
        tier: baseTier,
        tier_label: tierInfo.label,
        bumps: bumpsMeta,
        bumps_labels: bumpsLabelsMeta,
        ...(applyDiscount ? { email_discount: "1" } : {}),
        ...(email ? { lead_email: email } : {}),
      },
    });

    if (!session.client_secret) {
      return NextResponse.json(
        { error: "Klaida sukuriant užsakymą" },
        { status: 500 },
      );
    }

    // Capture the email as a warm lead. Supabase isn't wired in prod, so the
    // reliable channels are Telegram + the Stripe customer created above.
    if (email && applyDiscount) {
      await sendTelegramMessage(
        `📧 <b>Naujas lead checkout'e</b> (−21 € akcija atrakinta)\n${escapeHtml(email)} · ${escapeHtml(tierInfo.label)}`,
      ).catch(() => {});
    }

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (error) {
    console.error("[api/checkout-session] error", error);
    return NextResponse.json(
      { error: "Klaida sukuriant užsakymą" },
      { status: 500 },
    );
  }
}
