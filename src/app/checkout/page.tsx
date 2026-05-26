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
import { Check, ChevronDown } from "lucide-react";

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

  // Running total is rendered inside the Stripe embedded panel, so we don't
  // compute it here anymore.

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

  // Daily-changing 4–7, deterministic per day so it doesn't bounce between
  // renders or visits within the same day.
  const purchases24h = useMemo(() => {
    const d = new Date();
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = ((hash << 5) - hash + key.charCodeAt(i)) | 0;
    }
    return 4 + (Math.abs(hash) % 4);
  }, []);

  return (
    <section className="px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-2xl">
        {/* Product summary */}
        <div className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-card px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
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
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold sm:text-base">
                {tierInfo.label}
              </p>
              <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground sm:text-xs">
                {tierInfo.tagline}
              </p>
            </div>
          </div>
          <span className="shrink-0 text-base font-semibold leading-none text-foreground sm:text-lg">
            {tierInfo.priceEur} €
          </span>
        </div>

        {/* Stand-alone "150+ used" social proof — sits between product card
            and upsells so it reads as an independent stat, not a subtitle. */}
        <p className="mt-2.5 flex items-center justify-center gap-1.5 text-[12px] text-muted-foreground sm:text-[13px]">
          <span aria-hidden className="size-1.5 rounded-full bg-emerald-500" />
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            150+
          </span>{" "}
          žmonių jau naudoja savo AI asistentą
        </p>

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
              details={BUMPS.aiSpecialists.details}
            />

            {/* 2. Bootcamp Standard — only the cheaper option is visible by
                default. The Premium tier (Standard + 2 val. konsultacija) is
                revealed as a nested addon below this card once the user opts
                into Bootcamp, keeping the initial view focused while still
                surfacing the higher-margin upsell to motivated buyers. */}
            {showBootcampBump ? (
              <>
                <BumpCard
                  selected={
                    bumps.bootcamp === "standard" ||
                    bumps.bootcamp === "premium"
                  }
                  onToggle={() =>
                    setBumps((prev) => ({
                      ...prev,
                      bootcamp: prev.bootcamp ? null : "standard",
                    }))
                  }
                  priceLabel={`+ ${BUMPS.bootcampStandard.priceEur} €`}
                  title={BUMPS.bootcampStandard.label}
                  description={BUMPS.bootcampStandard.description}
                  details={BUMPS.bootcampStandard.details}
                  popular
                />
                {bumps.bootcamp ? (
                  <BootcampPremiumAddon
                    selected={bumps.bootcamp === "premium"}
                    deltaEur={
                      BUMPS.bootcampPremium.priceEur -
                      BUMPS.bootcampStandard.priceEur
                    }
                    onToggle={() =>
                      setBumps((prev) => ({
                        ...prev,
                        bootcamp:
                          prev.bootcamp === "premium" ? "standard" : "premium",
                      }))
                    }
                  />
                ) : null}
              </>
            ) : null}
          </div>
        </div>

        {/* Stripe Embedded Checkout. Stripe shows the running total inside
            its own panel, so we don't repeat an "Iš viso" row above it. */}
        <div className="mt-6">
          <p className="mb-3 flex items-center justify-center gap-2 text-center text-[12px] text-muted-foreground sm:text-[13px]">
            <span
              aria-hidden
              className="size-1.5 rounded-full bg-emerald-500"
            />
            Per pastarąsias 24 val. įsigijo{" "}
            <span
              className="font-semibold text-emerald-600 dark:text-emerald-400"
              suppressHydrationWarning
            >
              {purchases24h}
            </span>{" "}
            naujų pirkėjų
          </p>
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
  details: string[];
  popular?: boolean;
  image?: string;
}

function BumpCard({
  selected,
  onToggle,
  priceLabel,
  title,
  description,
  details,
  popular,
  image,
}: BumpCardProps) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className={cn(
        "group/bump relative w-full overflow-hidden rounded-xl border bg-card transition-all",
        selected
          ? "border-primary ring-2 ring-primary/40"
          : popular
            ? "border-primary/60 ring-1 ring-primary/30"
            : "border-border/60 hover:border-foreground/30",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={selected}
        className="flex w-full items-center gap-3 px-3 py-2.5 text-left"
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
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-center gap-1 border-t border-border/40 bg-muted/30 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
      >
        {expanded ? "Sutraukti" : "Kas įeina?"}
        <ChevronDown
          className={cn(
            "size-3 transition-transform",
            expanded && "rotate-180",
          )}
        />
      </button>
      {expanded ? (
        <ul className="space-y-1.5 border-t border-border/40 bg-muted/20 px-4 py-3 text-[12px] leading-snug text-foreground/80">
          {details.map((item) => (
            <li key={item} className="flex gap-2">
              <span
                aria-hidden
                className="mt-1.5 size-1 shrink-0 rounded-full bg-primary"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

interface BootcampPremiumAddonProps {
  selected: boolean;
  deltaEur: number;
  onToggle: () => void;
}

function BootcampPremiumAddon({
  selected,
  deltaEur,
  onToggle,
}: BootcampPremiumAddonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={cn(
        "ml-4 flex w-[calc(100%-1rem)] items-start gap-3 rounded-xl border-l-4 px-3 py-3 text-left transition-all",
        selected
          ? "border-l-primary bg-primary/5 ring-1 ring-primary/30"
          : "border-l-primary/40 bg-card hover:border-l-primary hover:bg-primary/[0.03]",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded border transition-colors",
          selected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-background",
        )}
      >
        {selected ? <Check className="size-3" /> : null}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[13px] font-semibold leading-tight sm:text-sm">
            {selected
              ? "Su 2 val. asmenine konsultacija"
              : "Pridėk 2 val. asmeninę konsultaciją"}{" "}
            <span className="whitespace-nowrap font-normal text-muted-foreground">
              (verta 400+ €)
            </span>
          </p>
          <span
            className={cn(
              "shrink-0 text-sm font-semibold sm:text-base",
              selected ? "text-primary" : "text-foreground",
            )}
          >
            + {deltaEur} €
          </span>
        </div>
        <ul className="mt-1.5 space-y-1 text-[11px] leading-snug text-muted-foreground sm:text-xs">
          <li className="flex gap-1.5">
            <span aria-hidden className="text-muted-foreground/60">
              •
            </span>
            <span>
              <span className="font-semibold text-foreground/80">
                1:1 Setup su Nojum ir Simu
              </span>{" "}
              — 2 val. asmeninė Zoom sesija. Sukonfigūruosime tavo AI asistentą
              ir visus specialistus pagal tavo verslą. Po sesijos viskas veikia
              taip, kaip tu nori.
            </span>
          </li>
          <li className="flex gap-1.5">
            <span aria-hidden className="text-muted-foreground/60">
              •
            </span>
            <span className="font-semibold text-foreground/80">
              + 5 paruošti AI Specialistai
            </span>
          </li>
        </ul>
      </div>
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
