import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import {
  getStripePriceId,
  getTier,
  isTierSlug,
  type TierSlug,
} from "@/lib/tiers";

export const metadata: Metadata = {
  title: "Užsakymas",
  description: "Užbaik užsakymą saugiai per Stripe.",
  robots: { index: false, follow: false },
};

const serifStyle = { fontFamily: "var(--font-serif)" } as const;

interface CheckoutPageProps {
  searchParams: Promise<{
    tier?: string | string[];
    [key: string]: string | string[] | undefined;
  }>;
}

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const params = await searchParams;
  const raw = Array.isArray(params.tier) ? params.tier[0] : params.tier;

  if (!isTierSlug(raw)) {
    return <InvalidTierState />;
  }

  const tier: TierSlug = raw;
  const tierInfo = getTier(tier);

  let sessionUrl: string | null = null;
  try {
    const headerList = await headers();
    const referer = headerList.get("referer");
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

    sessionUrl = session.url;
  } catch (error) {
    console.error("[checkout] Stripe session error", error);
    return <CheckoutErrorState />;
  }

  if (!sessionUrl) {
    return <CheckoutErrorState />;
  }

  redirect(sessionUrl);
}

function safeCancelUrl(referer: string | null): string {
  if (!referer) return `${env.siteUrl}/`;
  try {
    const url = new URL(referer);
    const siteUrl = new URL(env.siteUrl);
    // Only honor referer if it points to our own site, to avoid open redirect.
    if (url.host === siteUrl.host) {
      return url.toString();
    }
  } catch {
    // ignore parse errors
  }
  return `${env.siteUrl}/`;
}

function InvalidTierState() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6">
        <Card className="mx-auto w-full max-w-md rounded-2xl border-border/60 p-6 text-center sm:p-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
            Klaida
          </p>
          <h1
            className="mt-3 text-3xl font-medium leading-tight"
            style={serifStyle}
          >
            Nepavyko rasti produkto
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Nuoroda neturi galiojančio produkto. Grįžk į pradžią ir pasirink
            norimą pirkti pasiūlymą.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className={buttonVariants({
                size: "lg",
                className:
                  "h-12 w-full rounded-full text-sm font-semibold uppercase tracking-wider sm:w-auto sm:px-6",
              })}
            >
              Į pradžią
            </Link>
            <Link
              href="/bootcamp"
              className={buttonVariants({
                size: "lg",
                variant: "outline",
                className:
                  "h-12 w-full rounded-full text-sm font-semibold uppercase tracking-wider sm:w-auto sm:px-6",
              })}
            >
              Pamatyti bootcamp
            </Link>
          </div>
        </Card>
      </main>
      <SiteFooter />
    </>
  );
}

function CheckoutErrorState() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6">
        <Card className="mx-auto w-full max-w-md rounded-2xl border-border/60 p-6 text-center sm:p-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
            Klaida
          </p>
          <h1
            className="mt-3 text-3xl font-medium leading-tight"
            style={serifStyle}
          >
            Nepavyko sukurti užsakymo
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Atsiprašome, įvyko techninė klaida. Pabandyk dar kartą po kelių
            sekundžių arba parašyk mums į{" "}
            <a
              href="mailto:labas@aistudijos.lt"
              className="underline underline-offset-2"
            >
              labas@aistudijos.lt
            </a>
            .
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className={buttonVariants({
                size: "lg",
                className:
                  "h-12 w-full rounded-full text-sm font-semibold uppercase tracking-wider sm:w-auto sm:px-6",
              })}
            >
              Į pradžią
            </Link>
          </div>
        </Card>
      </main>
      <SiteFooter />
    </>
  );
}
