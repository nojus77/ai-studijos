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
  oneOnOne: boolean;
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
    oneOnOne: false,
  });

  const total = useMemo(() => {
    let sum = tierInfo.priceEur;
    if (showBootcampBump && bumps.bootcamp === "standard") {
      sum += BUMPS.bootcampStandard.priceEur;
    } else if (showBootcampBump && bumps.bootcamp === "premium") {
      sum += BUMPS.bootcampPremium.priceEur;
    }
    if (bumps.oneOnOne) {
      sum += BUMPS.oneOnOne.priceEur;
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
            oneOnOne: bumps.oneOnOne,
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
    <section className="px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          Užsakymas
        </p>
        <h1
          className="mt-3 text-balance text-[34px] font-medium leading-[1.05] tracking-tight sm:text-[44px]"
          style={serifStyle}
        >
          Užbaik užsakymą.
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
          Saugus mokėjimas per Stripe. Apmokėjus iškart gausi el. laišką su
          prieiga.
        </p>

        {/* Product summary card */}
        <Card className="mt-8 rounded-2xl border-border/60 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              {tier === "kursas" ? (
                <div className="size-14 shrink-0 overflow-hidden rounded-xl bg-muted">
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
                  className="inline-flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary text-[13px] font-bold text-primary-foreground"
                >
                  AI
                </span>
              )}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Tavo pasirinkimas
                </p>
                <p className="mt-1 text-lg font-semibold sm:text-xl">
                  {tierInfo.label}
                </p>
              </div>
            </div>
            <span
              className="shrink-0 text-2xl font-medium leading-none text-foreground sm:text-3xl"
              style={serifStyle}
            >
              {tierInfo.priceEur} €
            </span>
          </div>
        </Card>

        {/* Order bumps */}
        <div className="mt-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            Pridėk prie užsakymo
          </p>
          <h2
            className="mt-2 text-2xl font-medium leading-tight sm:text-3xl"
            style={serifStyle}
          >
            Padaryk pirkimą dar vertingesnį.
          </h2>

          <div className="mt-5 space-y-3">
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
                  popular
                />
              </>
            ) : null}

            <BumpCard
              selected={bumps.oneOnOne}
              onToggle={() =>
                setBumps((prev) => ({ ...prev, oneOnOne: !prev.oneOnOne }))
              }
              priceLabel={`+ ${BUMPS.oneOnOne.priceEur} €`}
              title={BUMPS.oneOnOne.label}
              description={BUMPS.oneOnOne.description}
            />
          </div>
        </div>

        {/* Total */}
        <div className="mt-8 flex items-baseline justify-between border-t border-border/60 pt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Iš viso
          </p>
          <p
            className="text-4xl font-medium italic leading-none sm:text-5xl"
            style={serifStyle}
          >
            {total} €
          </p>
        </div>

        {/* Stripe Embedded Checkout */}
        <div className="mt-8">
          {error ? (
            <Card className="rounded-2xl border-destructive/40 bg-destructive/5 p-6 text-center">
              <p
                className="text-2xl font-medium leading-tight"
                style={serifStyle}
              >
                Nepavyko įkelti apmokėjimo
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {error}. Pabandyk dar kartą arba parašyk{" "}
                <a
                  href="mailto:labas@aistudijos.lt"
                  className="underline underline-offset-2"
                >
                  labas@aistudijos.lt
                </a>
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
}

function BumpCard({
  selected,
  onToggle,
  priceLabel,
  title,
  description,
  popular,
}: BumpCardProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={cn(
        "group/bump relative flex w-full items-start gap-4 rounded-2xl border bg-card p-4 text-left transition-all sm:p-5",
        selected
          ? "border-primary ring-2 ring-primary/40"
          : "border-border/60 hover:border-foreground/30",
        popular && !selected ? "border-primary/40" : "",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors",
          selected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-background",
        )}
      >
        {selected ? <Check className="size-3.5" /> : null}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-base font-semibold leading-tight sm:text-lg">
            {title}
          </p>
          {popular ? (
            <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
              Populiariausias
            </span>
          ) : null}
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      <span
        className={cn(
          "shrink-0 self-center text-base font-semibold sm:text-lg",
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
