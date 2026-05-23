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
      oneOnOne: z.boolean().optional(),
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

    if (bumps.oneOnOne) {
      activeBumpIds.push("oneOnOne");
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

    // Note: Stripe SDK v22's TS types incorrectly label the request value as
    // `'embedded_page'`; the actual API accepts the documented `'embedded'`.
    // Cast keeps us aligned with current Stripe docs without changing runtime.
    const session = await stripe().checkout.sessions.create({
      ui_mode:
        "embedded" as unknown as Stripe.Checkout.SessionCreateParams["ui_mode"],
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      return_url: `${env.siteUrl}/aciu?session_id={CHECKOUT_SESSION_ID}`,
      locale: "lt",
      allow_promotion_codes: true,
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
