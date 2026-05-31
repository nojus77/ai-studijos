import type { Metadata } from "next";
import Link from "next/link";
import { Check, Mail } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import {
  BUMPS,
  getTier,
  isBumpId,
  isTierSlug,
  type BumpId,
  type TierSlug,
} from "@/lib/tiers";

export const metadata: Metadata = {
  title: "Ačiū! Užsakymas patvirtintas",
  description: "Sėkmingai pirkai. Tavo prieiga ir nuorodos viduje.",
  robots: { index: false, follow: false },
};

const serifStyle = { fontFamily: "var(--font-serif)" } as const;

interface AciuPageProps {
  searchParams: Promise<{
    session_id?: string | string[];
    [key: string]: string | string[] | undefined;
  }>;
}

interface PurchasedItem {
  id: string;
  label: string;
  amountCents: number;
}

interface SessionData {
  email: string | null;
  amountTotal: number | null;
  tier: TierSlug | null;
  bumps: BumpId[];
  items: PurchasedItem[];
}

export default async function AciuPage({ searchParams }: AciuPageProps) {
  const params = await searchParams;
  const raw = Array.isArray(params.session_id)
    ? params.session_id[0]
    : params.session_id;

  const data = await loadSession(raw);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <SuccessSection data={data} />
        <NextStepsSection tier={data.tier} bumps={data.bumps} />
      </main>
      <SiteFooter />
    </>
  );
}

async function loadSession(
  sessionId: string | undefined,
): Promise<SessionData> {
  if (!sessionId) {
    return {
      email: null,
      amountTotal: null,
      tier: null,
      bumps: [],
      items: [],
    };
  }
  try {
    const session = await stripe().checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });
    const tierRaw = session.metadata?.tier;
    const tier: TierSlug | null = isTierSlug(tierRaw) ? tierRaw : null;
    const bumpsMeta = session.metadata?.bumps ?? "";
    const bumps: BumpId[] = bumpsMeta
      .split(",")
      .map((s) => s.trim())
      .filter(isBumpId);

    // Build items list. Prefer Stripe-side line_items for authoritative amounts;
    // fall back to metadata-derived list otherwise.
    const items: PurchasedItem[] = [];
    const lineItems = session.line_items?.data ?? [];

    if (tier) {
      const tierInfo = getTier(tier);
      items.push({
        id: tier,
        label: tierInfo.label,
        amountCents: tierInfo.priceEur * 100,
      });
    }
    for (const bumpId of bumps) {
      const bump = BUMPS[bumpId];
      items.push({
        id: bumpId,
        label: bump.label,
        amountCents: bump.priceEur * 100,
      });
    }

    if (lineItems.length === items.length && lineItems.length > 0) {
      for (let i = 0; i < lineItems.length; i++) {
        const amount = lineItems[i].amount_total;
        if (typeof amount === "number") {
          items[i].amountCents = amount;
        }
      }
    }

    return {
      email: session.customer_details?.email ?? session.customer_email ?? null,
      amountTotal: session.amount_total ?? null,
      tier,
      bumps,
      items,
    };
  } catch (error) {
    console.error("[aciu] failed to retrieve session", error);
    return {
      email: null,
      amountTotal: null,
      tier: null,
      bumps: [],
      items: [],
    };
  }
}

function formatAmount(amountCents: number | null): string {
  if (amountCents == null) return "";
  const eur = amountCents / 100;
  return new Intl.NumberFormat("lt-LT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(eur);
}

function SuccessSection({ data }: { data: SessionData }) {
  return (
    <section className="px-4 pb-10 pt-12 sm:px-6 sm:pt-16">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          <span className="inline-flex size-5 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Check className="size-3" aria-hidden />
          </span>
          Apmokėta
        </div>
        <h1
          className="mt-4 text-balance text-[36px] font-medium leading-[1.05] tracking-tight sm:text-[44px]"
          style={serifStyle}
        >
          Ačiū! Tavo užsakymas patvirtintas.
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
          {data.email ? (
            <>
              Patvirtinimą bei prieigos nuorodas išsiuntėme į{" "}
              <span className="font-semibold text-foreground">
                {data.email}
              </span>
              . Jei nematai laiško per kelias minutes — patikrink „Spam“ aplanką
              arba parašyk mums.
            </>
          ) : (
            <>
              Patvirtinimą bei prieigos nuorodas išsiuntėme el. paštu, kurį
              nurodei pirkdamas.
            </>
          )}
        </p>

        {/* Itemized order */}
        {data.items.length > 0 ? (
          <Card className="mt-8 rounded-2xl border-border/60 p-5 sm:p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Pirkti pasiūlymai
            </p>
            <ul className="mt-3 space-y-2">
              {data.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-baseline justify-between gap-3 border-b border-border/40 pb-2 last:border-0 last:pb-0"
                >
                  <span className="text-sm font-medium sm:text-[15px]">
                    {item.label}
                  </span>
                  <span className="shrink-0 text-sm font-semibold text-foreground sm:text-[15px]">
                    {formatAmount(item.amountCents)}
                  </span>
                </li>
              ))}
            </ul>
            {data.amountTotal != null ? (
              <div className="mt-4 flex items-baseline justify-between border-t border-border/60 pt-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Iš viso
                </span>
                <span
                  className="text-2xl font-medium italic"
                  style={serifStyle}
                >
                  {formatAmount(data.amountTotal)}
                </span>
              </div>
            ) : null}
          </Card>
        ) : null}

        <Card className="mt-6 grid gap-4 rounded-2xl border-border/60 p-5 sm:grid-cols-2 sm:p-6">
          <SummaryItem
            label="Suma"
            value={formatAmount(data.amountTotal) || "—"}
          />
          <SummaryItem label="El. paštas" value={data.email ?? "—"} mono />
        </Card>

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4 text-sm leading-relaxed text-foreground/85 sm:text-base">
          <Mail className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
          <span>
            El. paštas su prieiga atsiųstas. Visa informacija — laiške.
          </span>
        </div>
      </div>
    </section>
  );
}

function SummaryItem({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p
        className={`mt-1 text-sm font-medium text-foreground sm:text-[15px] ${mono ? "break-all font-mono text-[13px]" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}

function NextStepsSection({
  tier,
  bumps,
}: {
  tier: TierSlug | null;
  bumps: BumpId[];
}) {
  if (!tier) {
    return <UnknownSteps />;
  }

  const hasKursas = tier === "kursas";
  const hasBootcamp =
    tier === "standard" ||
    tier === "premium" ||
    bumps.includes("bootcampStandard") ||
    bumps.includes("bootcampPremium");
  const hasAiSpecialists = bumps.includes("aiSpecialists");

  return (
    <section className="bg-muted/40 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <h2
          className="text-balance text-3xl font-medium leading-[1.1] tracking-tight sm:text-[40px]"
          style={serifStyle}
        >
          Ką dabar darai?
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Žemiau — visi tavo žingsniai, pagal tai ką pirkai.
        </p>

        <div className="mt-8 space-y-4">
          {hasKursas ? <KursasSteps /> : null}
          {hasBootcamp ? <BootcampSteps /> : null}
          {hasAiSpecialists ? <AiSpecialistsSteps /> : null}
          <CommunityStep />
        </div>

        {hasBootcamp ? (
          <div className="mt-8 text-center">
            <Link
              href="/dirbtuves"
              className={buttonVariants({
                size: "lg",
                variant: "outline",
                className:
                  "h-12 rounded-full px-6 text-sm font-semibold uppercase tracking-wider",
              })}
            >
              Pamatyti dirbtuvių programą
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function KursasSteps() {
  const videoUrl = optionalEnv(() => env.kursasVideoUrl());
  const pdfUrl = optionalEnv(() => env.kursasPdfUrl());

  return (
    <>
      <StepCard
        n="01"
        title="Žiūrėk video kursą"
        body="Pilnas video gidas — pradėk nuo pirmos pamokos ir eik savo tempu."
        ctaLabel={videoUrl ? "Atidaryti video" : "Bus atsiųsta el. paštu"}
        ctaHref={videoUrl}
      />
      <StepCard
        n="02"
        title="Atsisiųsk PDF"
        body="Spausdintinas šablonas su visomis komandomis ir prompto pavyzdžiais."
        ctaLabel={pdfUrl ? "Atsisiųsti PDF" : "Bus atsiųsta el. paštu"}
        ctaHref={pdfUrl}
      />
    </>
  );
}

function BootcampSteps() {
  return (
    <>
      <StepCard
        n="B1"
        title="Zoom nuoroda — likus 24 val."
        body="Likus dienai iki pirmos sesijos gausi atskirą laišką su Zoom nuoroda, kalendoriaus įvykiu ir paruošimo gidu."
      />
      <StepCard
        n="B2"
        title="Prieš sesiją — paruošimas"
        body="Vilius padės įsitikinti, kad tavo kompiuteryje viskas veikia. Jei iškils klausimų, jis pasieks tave el. paštu."
      />
    </>
  );
}

function AiSpecialistsSteps() {
  return (
    <StepCard
      n="5"
      title="5 AI Specialistai jau tavo"
      body="Paruoštus Claude įgūdžius (el. paštas, ataskaitos, tyrimai, klientų atsakymai, planavimas) gausi atskirame el. laiške per kelias minutes. Import'uok vieną kartą — ir veikia."
    />
  );
}

function CommunityStep() {
  const skoolUrl = optionalEnv(() => env.skoolInviteUrl());
  return (
    <StepCard
      n="C"
      title="Prisijunk prie bendruomenės"
      body="Skool grupė, kurioje matai, kaip kiti naudoja AI ir gauni atsakymus į klausimus."
      ctaLabel={skoolUrl ? "Prisijungti į Skool" : "Bus atsiųsta el. paštu"}
      ctaHref={skoolUrl}
    />
  );
}

function UnknownSteps() {
  return (
    <section className="bg-muted/40 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2
          className="text-balance text-3xl font-medium leading-[1.1] tracking-tight sm:text-[36px]"
          style={serifStyle}
        >
          Visos detalės — el. pašte.
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Jei laiško nematai per 5 minutes, užpildyk{" "}
          <Link href="/kontaktai" className="underline underline-offset-2">
            kontaktinę formą
          </Link>{" "}
          ir padėsime.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className={buttonVariants({
              size: "lg",
              className:
                "h-12 rounded-full px-6 text-sm font-semibold uppercase tracking-wider",
            })}
          >
            Į pradžią
          </Link>
        </div>
      </div>
    </section>
  );
}

function StepCard({
  n,
  title,
  body,
  ctaLabel,
  ctaHref,
}: {
  n: string;
  title: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <Card className="rounded-2xl border-border/60 p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <span
          className="text-3xl font-medium leading-none text-primary"
          style={serifStyle}
        >
          {n}
        </span>
        <div className="flex-1">
          <h3 className="text-lg font-semibold sm:text-xl">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {body}
          </p>
          {ctaLabel ? (
            ctaHref ? (
              <Link
                href={ctaHref}
                className={buttonVariants({
                  size: "lg",
                  className:
                    "mt-4 h-11 rounded-full px-5 text-xs font-semibold uppercase tracking-wider",
                })}
              >
                {ctaLabel}
              </Link>
            ) : (
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {ctaLabel}
              </p>
            )
          ) : null}
        </div>
      </div>
    </Card>
  );
}

function optionalEnv(getter: () => string | undefined): string | undefined {
  try {
    const value = getter();
    return value && value.length > 0 ? value : undefined;
  } catch {
    return undefined;
  }
}
