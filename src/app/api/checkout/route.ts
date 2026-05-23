import { NextResponse } from "next/server";
import { z } from "zod";

import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { getStripePriceId, getTier } from "@/lib/tiers";

const bodySchema = z.object({
  tier: z.enum(["kursas", "standard", "premium"]),
});

export async function POST(request: Request): Promise<Response> {
  try {
    const json = await request.json().catch(() => null);
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Neteisingas užsakymo tipas" },
        { status: 400 },
      );
    }

    const { tier } = parsed.data;
    const tierInfo = getTier(tier);
    const referer = request.headers.get("referer");
    const cancelUrl = safeCancelUrl(referer);

    const session = await stripe().checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{ price: getStripePriceId(tier), quantity: 1 }],
      success_url: `${env.siteUrl}/aciu?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      locale: "lt",
      billing_address_collection: "auto",
      allow_promotion_codes: true,
      metadata: {
        tier,
        tier_label: tierInfo.label,
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Klaida sukuriant užsakymą" },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[api/checkout] error", error);
    return NextResponse.json(
      { error: "Klaida sukuriant užsakymą" },
      { status: 500 },
    );
  }
}

function safeCancelUrl(referer: string | null): string {
  if (!referer) return `${env.siteUrl}/`;
  try {
    const url = new URL(referer);
    const siteUrl = new URL(env.siteUrl);
    if (url.host === siteUrl.host) {
      return url.toString();
    }
  } catch {
    // ignore
  }
  return `${env.siteUrl}/`;
}
