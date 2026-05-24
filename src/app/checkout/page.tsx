"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { Check } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BUMPS, getTier, isTierSlug, type TierSlug } from "@/lib/tiers";
import { cn } from "@/lib/utils";

const serifStyle = { fontFamily: "var(--font-serif)" } as const;

type BootcampBumpChoice = "standard" | "premium" | null;

interface BumpState {
  bootcamp: BootcampBumpChoice;
  aiSpecialists: boolean;
}

let stripePromise: Promise<Stripe | null> | null = null;
const getStripePromise = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    stripePromise = key ? loadStripe(key) : Promise.resolve(null);
  }
  return stripePromise;
};

export default function CheckoutPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Suspense fallback={<CheckoutSkeleton />}>
          <CheckoutInner />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}

function CheckoutInner() {
  const searchParams = useSearchParams();
  const rawTier = searchParams.get("tier") ?? undefined;

  if (!isTierSlug(rawTier)) {
    return <InvalidTierState />;
  }

  return <CheckoutFlow tier={rawTier} />;
}

interface CheckoutFlowProps {
  tier: TierSlug;
}

function CheckoutFlow({ tier }: CheckoutFlowProps) {
  const tierInfo = getTier(tier);
  const showBootcampBump = tier === "kursas";

  const [bumps, setBumps] = useState<BumpState>({
    bootcamp: null,
    aiSpecialists: false,
  });

  const total = useMemo(() => {
    let sum = tierInfo.priceEur;
    if (showBootcampBump && bumps.bootcamp === "standard") {
      sum += BUMPS.bootcampStandard.priceEur;
    } else if (showBootcampBump && bumps.bootcamp === "premium") {
      sum += BUMPS.bootcampPremium.priceEur;
    }
    if (bumps.aiSpecialists) {
      sum += BUMPS.aiSpecialists.priceEur;
    }
    return sum;
  }, [tierInfo.priceEur, showBootcampBump, bumps]);

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = useCallback(async () => {
    setLoading(true);
    setError(null);
    setClientSecret(null);
    try {
      const res = await fetch("/api/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          baseTier: tier,
          bumps: {
            bootcamp: showBootcampBump ? bumps.bootcamp : null,
            aiSpecialists: bumps.aiSpecialists,
          },
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        clientSecret?: string;
        error?: string;
      };
      if (!res.ok || !data.clientSecret) {
        setError(data.error ?? "Klaida sukuriant užsakymą");
        return;
      }
      setClientSecret(data.clientSecret);
    } catch (err) {
      console.error("[checkout] fetch session failed", err);
      setError("Klaida sukuriant užsakymą");
    } finally {
      setLoading(false);
    }
  }, [tier, showBootcampBump, bumps]);

  useEffect(() => {
    void fetchSession();
  }, [fetchSession]);

  const options = useMemo(
    () => (clientSecret ? { clientSecret } : null),
    [clientSecret],
  );

  return (
    <section className="px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-2xl">
        <h1
          className="text-balance text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl"
          style={serifStyle}
        >
          Užbaik užsakymą
        </h1>
        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
          Saugus mokėjimas per Stripe. Apmokėjus iškart gausi el. laišką su
          prieiga.
        </p>

        {/* Compact product summary row */}
        <div className="mt-6 flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-card px-4 py-3">
          <div className="flex items-center gap-3">
            {tier === "kursas" ? (
              <div className="size-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image
                  src="/product.png"
                  alt=""
                  width={1536}
                  height={1024}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <span
                aria-hidden
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-[11px] font-bold text-primary-foreground"
              >
                AI
              </span>
            )}
            <p className="text-sm font-semibold sm:text-base">
              {tierInfo.label}
            </p>
          </div>
          <span
            className="shrink-0 text-xl font-medium leading-none text-foreground sm:text-2xl"
            style={serifStyle}
          >
            {tierInfo.priceEur} €
          </span>
        </div>

        {/* Order bumps — compact */}
        <div className="mt-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            Pridėk prie užsakymo
          </p>
          <div className="mt-2 space-y-2">
            {/* 1. 5 AI Specialistai (small upsell first) */}
            <BumpCard
              selected={bumps.aiSpecialists}
              onToggle={() =>
                setBumps((prev) => ({
                  ...prev,
                  aiSpecialists: !prev.aiSpecialists,
                }))
              }
              priceLabel={`+ ${BUMPS.aiSpecialists.priceEur} €`}
              title={BUMPS.aiSpecialists.label}
              description={BUMPS.aiSpecialists.description}
            />

            {/* 2. Bootcamp (POPULIARIAUSIAS) + 3. Bootcamp Premium (only on /checkout?tier=kursas) */}
            {showBootcampBump ? (
              <>
                <BumpCard
                  selected={bumps.bootcamp === "standard"}
                  onToggle={() =>
                    setBumps((prev) => ({
                      ...prev,
                      bootcamp:
                        prev.bootcamp === "standard" ? null : "standard",
                    }))
                  }
                  priceLabel={`+ ${BUMPS.bootcampStandard.priceEur} €`}
                  title={BUMPS.bootcampStandard.label}
                  description={BUMPS.bootcampStandard.description}
                  popular
                />
                <BumpCard
                  selected={bumps.bootcamp === "premium"}
                  onToggle={() =>
                    setBumps((prev) => ({
                      ...prev,
                      bootcamp: prev.bootcamp === "premium" ? null : "premium",
                    }))
                  }
                  priceLabel={`+ ${BUMPS.bootcampPremium.priceEur} €`}
                  title={BUMPS.bootcampPremium.label}
                  description={BUMPS.bootcampPremium.description}
                />
              </>
            ) : null}
          </div>
        </div>

        {/* Total — compact single row */}
        <div className="mt-5 flex items-baseline justify-between border-t border-border/60 pt-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Iš viso
          </p>
          <p
            className="text-2xl font-medium italic leading-none sm:text-3xl"
            style={serifStyle}
          >
            {total} €
          </p>
        </div>

        {/* Stripe Embedded Checkout */}
        <div className="mt-5">
          {error ? (
            <Card className="rounded-2xl border-destructive/40 bg-destructive/5 p-6 text-center">
              <p
                className="text-2xl font-medium leading-tight"
                style={serifStyle}
              >
                Nepavyko įkelti apmokėjimo
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {error}. Pabandyk dar kartą arba{" "}
                <Link
                  href="/kontaktai"
                  className="underline underline-offset-2"
                >
                  parašyk mums per kontaktinę formą
                </Link>
                .
              </p>
              <button
                type="button"
                onClick={() => void fetchSession()}
                className={cn(
                  buttonVariants({
                    size: "lg",
                    className:
                      "mt-5 h-11 rounded-full px-5 text-xs font-semibold uppercase tracking-wider",
                  }),
                )}
              >
                Bandyti dar kartą
              </button>
            </Card>
          ) : loading || !options ? (
            <Card className="flex min-h-[320px] items-center justify-center rounded-2xl border-border/60 p-6">
              <p className="text-sm text-muted-foreground">
                Kraunamas saugus apmokėjimas…
              </p>
            </Card>
          ) : (
            <div className="overflow-hidden rounded-2xl ring-1 ring-foreground/10">
              <EmbeddedCheckoutProvider
                stripe={getStripePromise()}
                options={options}
                // Force remount when client secret changes (bumps toggled).
                key={options.clientSecret}
              >
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Apmokėdamas sutinki su mūsų{" "}
          <Link
            href="/salygos"
            className="underline underline-offset-2 hover:text-foreground"
          >
            sąlygomis
          </Link>{" "}
          ir{" "}
          <Link
            href="/privatumas"
            className="underline underline-offset-2 hover:text-foreground"
          >
            privatumo politika
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

interface BumpCardProps {
  selected: boolean;
  onToggle: () => void;
  priceLabel: string;
  title: string;
  description: string;
  popular?: boolean;
  image?: string;
}

function BumpCard({
  selected,
  onToggle,
  priceLabel,
  title,
  description,
  popular,
  image,
}: BumpCardProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={cn(
        "group/bump relative flex w-full items-center gap-3 rounded-xl border bg-card px-3 py-2.5 text-left transition-all",
        selected
          ? "border-primary ring-2 ring-primary/40"
          : popular
            ? "border-primary/60 ring-1 ring-primary/30"
            : "border-border/60 hover:border-foreground/30",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "inline-flex size-4 shrink-0 items-center justify-center rounded border transition-colors",
          selected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-background",
        )}
      >
        {selected ? <Check className="size-3" /> : null}
      </span>
      {image ? (
        <div className="size-12 shrink-0 overflow-hidden rounded-md bg-foreground">
          <Image
            src={image}
            alt=""
            width={1440}
            height={736}
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <p className="text-[13px] font-semibold leading-tight sm:text-sm">
            {title}
          </p>
          {popular ? (
            <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-primary">
              Populiariausias
            </span>
          ) : null}
        </div>
        <p className="mt-0.5 line-clamp-1 text-[11px] leading-snug text-muted-foreground">
          {description}
        </p>
      </div>
      <span
        className={cn(
          "shrink-0 text-sm font-semibold sm:text-base",
          selected ? "text-primary" : "text-foreground",
        )}
      >
        {priceLabel}
      </span>
    </button>
  );
}

function CheckoutSkeleton() {
  return (
    <section className="px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-2xl">
        <Card className="flex min-h-[320px] items-center justify-center rounded-2xl border-border/60 p-6">
          <p className="text-sm text-muted-foreground">Kraunama…</p>
        </Card>
      </div>
    </section>
  );
}

function InvalidTierState() {
  return (
    <section className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6">
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
    </section>
  );
}
