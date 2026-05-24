import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { z } from "zod";

import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import {
  BUMPS,
  getBump,
  getStripePriceId,
  getTier,
  type BumpId,
} from "@/lib/tiers";

const bodySchema = z.object({
  baseTier: z.enum(["kursas", "standard", "premium"]),
  bumps: z
    .object({
      bootcamp: z.enum(["standard", "premium"]).nullable().optional(),
      aiSpecialists: z.boolean().optional(),
    })
    .default({}),
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

    const { baseTier, bumps } = parsed.data;
    const tierInfo = getTier(baseTier);

    // Resolve which bumps are active.
    const activeBumpIds: BumpId[] = [];

    // Bootcamp bumps are only valid when buying the base "kursas".
    if (baseTier === "kursas" && bumps.bootcamp) {
      if (bumps.bootcamp === "standard") {
        activeBumpIds.push("bootcampStandard");
      } else if (bumps.bootcamp === "premium") {
        activeBumpIds.push("bootcampPremium");
      }
    }

    if (bumps.aiSpecialists) {
      activeBumpIds.push("aiSpecialists");
    }

    // Build line items.
    type LineItem = NonNullable<
      Stripe.Checkout.SessionCreateParams["line_items"]
    >[number];

    const lineItems: LineItem[] = [
      { price: getStripePriceId(baseTier), quantity: 1 },
    ];

    for (const bumpId of activeBumpIds) {
      const bump = getBump(bumpId);
      lineItems.push({ price: bump.getPriceId(), quantity: 1 });
    }

    const bumpsMeta = activeBumpIds.join(",");
    const bumpsLabelsMeta = activeBumpIds
      .map((id) => BUMPS[id].label)
      .join(" + ");

    const session = await stripe().checkout.sessions.create({
      ui_mode: "embedded_page",
      mode: "payment",
      // automatic_payment_methods auto-includes every method the user enabled
      // in Stripe dashboard (card + Revolut Pay + Apple/Google Pay + Link etc.)
      automatic_payment_methods: { enabled: true },
      line_items: lineItems,
      return_url: `${env.siteUrl}/aciu?session_id={CHECKOUT_SESSION_ID}`,
      locale: "lt",
      allow_promotion_codes: true,
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
      },
    });

    if (!session.client_secret) {
      return NextResponse.json(
        { error: "Klaida sukuriant užsakymą" },
        { status: 500 },
      );
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
