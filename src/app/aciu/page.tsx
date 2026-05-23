import type { Metadata } from "next";
import Link from "next/link";
import { Check, Mail } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { getTier, isTierSlug, type TierSlug } from "@/lib/tiers";

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

interface SessionData {
  email: string | null;
  amountTotal: number | null;
  tier: TierSlug | null;
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
        <NextStepsSection tier={data.tier} />
      </main>
      <SiteFooter />
    </>
  );
}

async function loadSession(
  sessionId: string | undefined,
): Promise<SessionData> {
  if (!sessionId) {
    return { email: null, amountTotal: null, tier: null };
  }
  try {
    const session = await stripe().checkout.sessions.retrieve(sessionId);
    const tierRaw = session.metadata?.tier;
    return {
      email: session.customer_details?.email ?? session.customer_email ?? null,
      amountTotal: session.amount_total ?? null,
      tier: isTierSlug(tierRaw) ? tierRaw : null,
    };
  } catch (error) {
    console.error("[aciu] failed to retrieve session", error);
    return { email: null, amountTotal: null, tier: null };
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
  const tierInfo = data.tier ? getTier(data.tier) : null;
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

        <Card className="mt-8 grid gap-4 rounded-2xl border-border/60 p-5 sm:grid-cols-3 sm:p-6">
          <SummaryItem
            label="Pirktas pasiūlymas"
            value={tierInfo?.label ?? "—"}
          />
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

function NextStepsSection({ tier }: { tier: TierSlug | null }) {
  if (tier === "kursas") {
    return <KursasSteps />;
  }
  if (tier === "standard" || tier === "premium") {
    return <BootcampSteps />;
  }
  return <UnknownSteps />;
}

function KursasSteps() {
  const videoUrl = optionalEnv(() => env.kursasVideoUrl());
  const pdfUrl = optionalEnv(() => env.kursasPdfUrl());
  const skoolUrl = optionalEnv(() => env.skoolInviteUrl());

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
          Trys nuorodos žemiau — viskas, ko tau reikia, kad pradėtum šiandien.
        </p>

        <div className="mt-8 space-y-4">
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
          <StepCard
            n="03"
            title="Prisijunk prie bendruomenės"
            body="Skool grupė, kurioje matai, kaip kiti naudoja AI ir gauni atsakymus į klausimus."
            ctaLabel={
              skoolUrl ? "Prisijungti į Skool" : "Bus atsiųsta el. paštu"
            }
            ctaHref={skoolUrl}
          />
        </div>
      </div>
    </section>
  );
}

function BootcampSteps() {
  const skoolUrl = optionalEnv(() => env.skoolInviteUrl());
  return (
    <section className="bg-muted/40 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <h2
          className="text-balance text-3xl font-medium leading-[1.1] tracking-tight sm:text-[40px]"
          style={serifStyle}
        >
          Ką toliau?
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Tavo vieta rezervuota. Žemiau — ko tikėtis artimiausiomis savaitėmis.
        </p>

        <div className="mt-8 space-y-4">
          <StepCard
            n="01"
            title="Zoom nuoroda — likus 24 val."
            body="Likus dienai iki pirmos sesijos gausi atskirą laišką su Zoom nuoroda, kalendoriaus įvykiu ir paruošimo gidu."
          />
          <StepCard
            n="02"
            title="Prieš sesiją — paruošimas"
            body="Vilius padės įsitikinti, kad tavo kompiuteryje viskas veikia. Jei iškils klausimų, jis pasieks tave el. paštu."
          />
          <StepCard
            n="03"
            title="Bendruomenė laukia"
            body="Prisijunk prie AI Studijos Skool ir susipažink su grupe dar prieš startą."
            ctaLabel={
              skoolUrl ? "Prisijungti į Skool" : "Bus atsiųsta el. paštu"
            }
            ctaHref={skoolUrl}
          />
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/bootcamp"
            className={buttonVariants({
              size: "lg",
              variant: "outline",
              className:
                "h-12 rounded-full px-6 text-sm font-semibold uppercase tracking-wider",
            })}
          >
            Pamatyti bootcamp programą
          </Link>
        </div>
      </div>
    </section>
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
          Jei laiško nematai per 5 minutes, parašyk{" "}
          <a
            href="mailto:labas@aistudijos.lt"
            className="underline underline-offset-2"
          >
            labas@aistudijos.lt
          </a>{" "}
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
