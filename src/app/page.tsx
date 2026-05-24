import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Check,
  Clock,
  Lock,
  MessageSquare,
  Settings2,
  Shield,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

import { CTABand } from "@/components/cta-band";
import { HeroVideo } from "@/components/hero-video";
import { HighlightedItalic } from "@/components/highlighted-italic";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { homeContent as c } from "./_content";

export const metadata: Metadata = {
  title: "AI Studijos · AI Asistento gidas",
  description:
    "Per 30 minučių išmoksi, kaip AI sutaupo 2 val. kiekvieną dieną. Vienkartinė 47 € investicija — asistentas visam gyvenimui.",
};

const serifStyle = { fontFamily: "var(--font-serif)" } as const;

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <TimeSavingSection />
        <PricingTeaserSection />
        <AboutSection />
        <StatsGridSection />
        <FounderStorySection />
        <VideoTestimonialsSection />
        <MarketStatsSection />
        <ProductivityStatsSection />
        <CommunityProofSection />
        <FeaturePillarsSection />
        <UrgencyIntroSection />
        <PrimaryPricingSection />
        <PersonaSection />
        <GuaranteeSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <SiteFooter />
    </>
  );
}

/* ───────────────────── 1. Hero ───────────────────── */

function HeroSection() {
  return (
    <section className="px-4 pb-12 pt-10 sm:px-6 sm:pt-14">
      <div className="mx-auto max-w-2xl text-center">
        {/* Strong short headline */}
        <h1
          className="text-balance text-[40px] font-extrabold leading-[1.05] tracking-[-0.02em] text-foreground sm:text-[56px] md:text-[64px]"
          style={serifStyle}
        >
          Tavo{" "}
          <HighlightedItalic marker={false}>AI asistentas</HighlightedItalic>{" "}
          per 30 minučių.
        </h1>

        {/* Smooth low-attention subtitle */}
        <p className="mx-auto mt-5 max-w-lg text-[15px] leading-[1.6] text-muted-foreground sm:text-base">
          Rašo el. paštus, daro ataskaitas iš Excel, atlieka tyrimus, planuoja
          savaitę — ir tai tik pradžia. Grąžina{" "}
          <strong className="font-semibold text-foreground">
            15+ valandų per savaitę
          </strong>
          .
        </p>

        {/* Autoplay muted video with tap-to-unmute */}
        {/* TODO: dabartinis hero-video.mp4 yra 68MB test file (iPhone MOV
            renamed) — produkcijai transkoduok į ~5-10MB H.264 + WebM */}
        <div className="mt-8">
          <HeroVideo src="/hero-video.mp4" />
        </div>

        {/* Primary CTA */}
        <div className="mt-8">
          <Link
            href={c.checkoutHref}
            className={buttonVariants({
              size: "lg",
              className:
                "cta-glow h-14 w-full justify-center rounded-xl bg-primary px-6 text-sm font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 sm:w-auto sm:text-base",
            })}
          >
            <span>Gauti AI asistentą</span>
            <ArrowRight className="ml-2 size-5" aria-hidden />
          </Link>
          <p className="mt-3 text-xs text-muted-foreground sm:text-sm">
            {c.product.price} € vienkartinis mokėjimas · 14 dienų garantija
          </p>
        </div>

        {/* Social proof row — 5 buyer avatars + counter */}
        {/* TODO: wire'ink "naudoja / liko vietos" skaičius į Supabase realių pirkimų count */}
        <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-border bg-card px-4 py-2 shadow-sm">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Image
                key={i}
                src={`/avatars/avatar${i}.png`}
                alt=""
                width={28}
                height={28}
                className="size-7 rounded-full border-2 border-card object-cover"
                priority={i === 1}
              />
            ))}
          </div>
          <p className="text-xs font-medium text-foreground sm:text-sm">
            <span className="font-bold">78 naudoja</span>
            <span className="mx-2 text-muted-foreground">·</span>
            <span className="font-bold text-red-600">liko 22 vietos</span>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── 2. Time-saving value props ───────────────────── */

function TimeSavingSection() {
  const bullets = [
    {
      icon: MessageSquare,
      title: "El. pašto atsakymai per sekundes, ne valandas.",
      body: "AI atsako į laiškus tavo stiliumi, o tu tik patvirtini.",
    },
    {
      icon: BarChart3,
      title: "Ataskaitos, kurios susikuria pačios.",
      body: "Iš Excel ar Google Sheets — be rankinio kopijavimo.",
    },
    {
      icon: Brain,
      title: "Tyrimai per minutes, ne dienas.",
      body: "AI peržiūri šimtus šaltinių ir paruošia santrauką su nuorodom.",
    },
    {
      icon: Zap,
      title: "Pasikartojančios užduotys — autopilotu.",
      body: "Rutiną daro AI, tu — pelningiausius darbus.",
    },
  ];

  return (
    <section className="bg-muted/40 px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-2xl">
        <h2
          className="text-balance text-2xl font-extrabold leading-[1.4] tracking-[-0.02em] sm:text-3xl"
          style={serifStyle}
        >
          Sutaupyk <HighlightedItalic>2 valandas</HighlightedItalic> kiekvieną
          dieną.
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          4 konkretūs darbai, kuriuos AI perima vos tik perskaitai gidą.
        </p>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {bullets.map((b) => (
            <div
              key={b.title}
              className="flex flex-row items-start gap-3 rounded-xl border border-border/60 bg-card p-3"
            >
              <div
                aria-hidden
                className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-foreground text-background"
              >
                <b.icon className="size-4" />
              </div>
              <div>
                <h3 className="text-[13px] font-semibold leading-tight">
                  {b.title}
                </h3>
                <p className="mt-0.5 text-[12px] leading-snug text-muted-foreground">
                  {b.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── 3. Mid-page Pricing Teaser ───────────────────── */

function PricingTeaserSection() {
  const features = [
    "Video pamoka (~30 min.) su pavyzdžiais",
    "5 paruošti AI darbo workflow'ai (ne tik promptai — pilni scenarijai)",
    "Nemokama prieiga prie AI Studijos bendruomenės",
    "Atnaujinimai amžinai — be papildomų mokesčių",
  ];

  return (
    <section id="kaina-teaser" className="px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <Card className="relative overflow-hidden rounded-3xl border-2 border-red-500 p-6 shadow-[0_0_0_4px_rgba(239,68,68,0.12)] sm:p-8">
          {/* Corner ribbon: jumbo -51% */}
          <div className="absolute right-0 top-0">
            <div className="flex items-center gap-2 rounded-bl-2xl bg-red-500 px-4 py-2 text-background shadow-lg">
              <span className="text-2xl font-black leading-none">
                {c.product.discountLabel}
              </span>
              <span className="hidden text-[10px] font-bold uppercase leading-tight tracking-wider sm:inline">
                Sutaupai
                <br />
                50 €
              </span>
            </div>
          </div>

          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-red-600">
            Ribotas laiko pasiūlymas
          </p>

          <div className="mt-5 flex items-baseline gap-3">
            <p
              className="text-5xl font-medium leading-none sm:text-6xl"
              style={serifStyle}
            >
              {c.product.price} €
            </p>
            <p
              className="text-2xl text-muted-foreground line-through sm:text-3xl"
              style={serifStyle}
            >
              {c.product.originalPrice} €
            </p>
          </div>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Vienkartinis mokėjimas · po akcijos kaina kils iki{" "}
            {c.product.originalPrice} €
          </p>

          <ul className="mt-6 space-y-2.5">
            {features.map((f) => (
              <li
                key={f}
                className="flex items-start gap-3 text-sm leading-relaxed sm:text-base"
              >
                <Check
                  className="mt-0.5 size-5 shrink-0 text-primary"
                  aria-hidden
                />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          {/* Scarcity bar */}
          <ScarcityBar />

          <Link
            href={c.checkoutHref}
            className={buttonVariants({
              size: "lg",
              className:
                "mt-6 h-14 w-full justify-between rounded-2xl text-sm font-semibold uppercase tracking-wider sm:text-base",
            })}
          >
            <span>Užimti vietą · {c.product.price} €</span>
            <ArrowRight className="size-5" aria-hidden />
          </Link>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            14 dienų pinigų grąžinimo garantija
          </p>
        </Card>
      </div>
    </section>
  );
}

function ScarcityBar() {
  // TODO: jei norėsi tikrą scarcity counterį — wire'ink į Supabase pirkėjų skaičių
  // ir grąžink šitą komponentą su realiais duomenimis. Kol tokio nėra — nerodom nieko.
  return null;
}

/* ───────────────────── 3.5. About AI Studijos ───────────────────── */

function AboutSection() {
  const team = [
    {
      name: "Nojus",
      role: "Įkūrėjas · AI praktikas",
      photo: "/team-nojus.jpg",
    },
    {
      name: "Simas",
      role: "Įkūrėjas · Praktiniai mokymai",
      photo: "/team-simas.jpg",
    },
  ];

  return (
    <section className="px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Kas mes
        </p>
        <h2
          className="mt-2 text-balance text-2xl font-extrabold leading-[1.1] tracking-[-0.02em] sm:text-3xl"
          style={serifStyle}
        >
          Du lietuviai, kurie{" "}
          <HighlightedItalic>AI naudoja kasdien</HighlightedItalic>.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          AI Studijos — tai du draugai, kurie patys per pastaruosius metus iš
          nulio susikūrė AI asistentus savo darbams. Surinkome viską, ką
          išmokome, į vieną gidą — be teorijos, be sudėtingų terminų. Tik tai,
          kas veikia.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {team.map((m) => (
            <div
              key={m.name}
              className="flex flex-1 items-center gap-3 rounded-2xl border border-border bg-card p-4"
            >
              <Image
                src={m.photo}
                alt={m.name}
                width={400}
                height={400}
                className="size-12 shrink-0 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-bold leading-tight">{m.name}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {m.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── 4. Stats Grid (2×2) ───────────────────── */

function StatsGridSection() {
  const stats = [
    { value: "30", label: "Min. iki rezultato" },
    { value: "0", label: "Programavimo žinių" },
    { value: "∞", label: "Visam gyvenimui" },
    { value: "24/7", label: "Asistentas dirba" },
  ];

  return (
    <section className="bg-background px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-2xl">
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {stats.map((s) => (
            <Card
              key={s.label}
              className="rounded-xl border-primary/30 bg-primary px-3 py-3 text-center text-primary-foreground sm:py-4"
            >
              <p
                className="text-2xl font-medium leading-none sm:text-3xl"
                style={serifStyle}
              >
                {s.value}
              </p>
              <p className="mt-1.5 whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.14em] text-primary-foreground/85 sm:text-[10px]">
                {s.label}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── 5. Founder story ───────────────────── */

function FounderStorySection() {
  return (
    <section className="bg-muted/40 px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <Badge className="rounded-full bg-foreground px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-background hover:bg-foreground">
          Kelionės pradžia
        </Badge>
        <h2
          className="mt-4 text-balance text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl md:text-[44px]"
          style={serifStyle}
        >
          Trumpai apie <HighlightedItalic>AI Studijas</HighlightedItalic>.
        </h2>

        <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-foreground/90 sm:text-base">
          {/* TODO: parašyk savo autentišką istoriją — kas esat, kodėl pradėjot, kaip naudojate AI patys */}
          <p className="text-muted-foreground italic">
            [Placeholder — pakeisk su tikra komandos istorija. Aprašyk, kas
            esate, kodėl pradėjote AI Studijas ir ką patys padarėte su AI prieš
            mokant kitus. Trumpai, žmogiškai, 2–3 pastraipos.]
          </p>
          <p className="text-muted-foreground">
            Jei turi klausimų — užpildyk{" "}
            <Link href="/kontaktai" className="underline underline-offset-2">
              kontaktinę formą
            </Link>
            . Atsakome per parą.
          </p>
        </div>

        {/* Two-founder photo placeholder */}
        <Card className="mt-8 flex flex-row items-center gap-4 rounded-2xl border-border/60 p-4 sm:p-5">
          <div className="flex -space-x-3">
            {/* TODO: replace with real founder photos */}
            <div
              className="size-14 shrink-0 rounded-full border-2 border-background bg-muted"
              aria-hidden
            />
            <div
              className="size-14 shrink-0 rounded-full border-2 border-background bg-muted"
              aria-hidden
            />
          </div>
          <div>
            <p className="text-base font-semibold leading-tight">
              AI Studijos komanda
            </p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Nojus &amp; Vilius · Vilnius
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}

/* ───────────────────── 6. Video testimonials stack ───────────────────── */

function VideoTestimonialsSection() {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <h2
          className="text-balance text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl md:text-[44px]"
          style={serifStyle}
        >
          Tikri žmonės, <HighlightedItalic>tikri rezultatai.</HighlightedItalic>
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Pirmieji pirkėjai jau pradeda dirbti su gidu. Atsiliepimus pridėsime,
          kai turėsime tikrų — be aktorių, be išgalvotų istorijų.
        </p>

        {/* TODO: kai turėsi realius vaizdo atsiliepimus — pakeisk šitą placeholder'į */}
        <Card className="mt-6 rounded-2xl border-dashed border-border/60 bg-muted/30 p-8 text-center">
          <p
            className="text-lg leading-snug text-muted-foreground sm:text-xl"
            style={serifStyle}
          >
            Tavo atsiliepimas — galimai pirmasis.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Įsigyk gidą, išbandyk, ir mes mielai įdėsim tavo istoriją čia.
          </p>
        </Card>
      </div>
    </section>
  );
}

/* ───────────────────── 7. Dark "Kodėl dabar?" market stats ───────────────────── */

function MarketStatsSection() {
  return (
    <section className="relative bg-foreground px-4 py-14 text-background sm:px-6 sm:py-20">
      {/* Decorative !! in the empty top-right corner */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-5 top-8 select-none text-5xl font-black leading-none text-red-500 sm:right-10 sm:top-12 sm:text-6xl"
        style={{ transform: "rotate(8deg)" }}
      >
        !!
      </span>

      <div className="mx-auto max-w-2xl">
        <Badge className="rounded-full bg-foreground px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-background hover:bg-foreground">
          Kodėl dabar?
        </Badge>

        <h2
          className="mt-4 text-balance text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl md:text-[44px]"
          style={serifStyle}
        >
          AI rinka auga{" "}
          <HighlightedItalic marker={false}>15 kartų</HighlightedItalic> per 2
          metus.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-background/80 sm:text-base">
          Tai nėra dar viena „technologijos banga, kuri praeis“. Tai didžiausias
          produktyvumo lūžis nuo interneto atsiradimo. Kas neprisitaikys per
          artimiausius metus — liks toli užnugaryje.
        </p>

        <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
          <DarkStatCard top="1.5 mlrd." bottom="AI naudotojų pasaulyje" />
          <DarkStatCard top="100M → 1.5B" bottom="Augimas per 2 metus" />
          <DarkStatCard top="15×" bottom="Augimo tempas" emphasis />
        </div>

        {/* Line chart placeholder */}
        <Card className="mt-6 overflow-hidden rounded-2xl border-background/15 bg-background/10 p-5 sm:p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-background/70">
            AI naudotojai · 2023 → 2026
          </p>
          {/* TODO: replace with real chart */}
          <div className="mt-4 flex h-32 items-end gap-2 sm:h-40" aria-hidden>
            {[8, 14, 22, 35, 52, 70, 88, 100].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-md bg-primary/40"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-wider text-background/60">
            <span>2023</span>
            <span className="flex items-center gap-1 text-primary">
              <TrendingUp className="size-3" aria-hidden />
              +1400 %
            </span>
            <span>2026</span>
          </div>
        </Card>
      </div>
    </section>
  );
}

function DarkStatCard({
  top,
  bottom,
  emphasis,
}: {
  top: string;
  bottom: string;
  emphasis?: boolean;
}) {
  return (
    <Card
      className={cn(
        "rounded-2xl p-4 text-center sm:p-5",
        emphasis
          ? "border-primary bg-primary text-primary-foreground"
          : "border-background/15 bg-background/10 text-background",
      )}
    >
      <p
        className="text-2xl font-medium leading-none sm:text-3xl"
        style={serifStyle}
      >
        {top}
      </p>
      <p
        className={cn(
          "mt-2 text-[10px] font-semibold uppercase tracking-[0.14em]",
          emphasis ? "text-primary-foreground/80" : "text-background/70",
        )}
      >
        {bottom}
      </p>
    </Card>
  );
}

/* ───────────────────── 8. "Vienas su AI = 5 be AI" ───────────────────── */

function ProductivityStatsSection() {
  const stats = [
    { value: "300M", label: "Darbo vietų transformuosis pasaulyje" },
    { value: "70 %", label: "Įmonių jau naudoja AI kasdien" },
    { value: "2026", label: "Metai, kai AI taps standartu" },
  ];

  return (
    <section className="px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2
          className="text-balance text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl md:text-[44px]"
          style={serifStyle}
        >
          Vienas žmogus su AI <HighlightedItalic>daro tiek</HighlightedItalic>{" "}
          kiek 5 be jo.
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Ne mūsų išgalvota statistika — Goldman Sachs, McKinsey ir Stanford
          tyrimų vidurkis. Realybė lenkia bet kokius prognozes.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-4">
          {stats.map((s) => (
            <div key={s.label}>
              <p
                className="text-6xl font-medium leading-none text-primary sm:text-7xl"
                style={serifStyle}
              >
                {s.value}
              </p>
              <p className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground sm:text-[11px]">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── 9. Skool community proof ───────────────────── */

function CommunityProofSection() {
  return (
    <section className="bg-muted/40 px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <Badge className="rounded-full bg-foreground px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-background hover:bg-foreground">
          AI Studijos bendruomenė
        </Badge>
        <h2
          className="mt-4 text-balance text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl md:text-[44px]"
          style={serifStyle}
        >
          Pradedam <HighlightedItalic>kartu.</HighlightedItalic>
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Įsigijęs gidą automatiškai gauni prieigą prie privačios{" "}
          {c.community.platform} bendruomenės — vieta, kur dalinamės naujais
          promptais, pavyzdžiais ir padedam vieni kitiems.
        </p>

        {/* Community cover banner */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-border/60 bg-background">
          <Image
            src="/cover.png"
            alt="AI Studijos · Lietuviška AI bendruomenė"
            width={2064}
            height={512}
            className="w-full"
          />
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground sm:text-sm">
          Prisijunk pirmas — ir tavo vardas atsiras bendruomenės wall&apos;e.
        </p>
      </div>
    </section>
  );
}

/* ───────────────────── 10. Feature pillars ───────────────────── */

function FeaturePillarsSection() {
  const pillars = [
    {
      icon: MessageSquare,
      title: "Komunikacija",
      body: "Rašo el. paštus, pasiūlymus klientams, atsakymus į komentarus — viskas tavo tonu.",
    },
    {
      icon: Brain,
      title: "Strategija",
      body: "Analizuoja rinką, padeda kurti veiksmų planus, generuoja idėjas iš tavo duomenų.",
    },
    {
      icon: Settings2,
      title: "Automatizavimas",
      body: "Pasikartojančias užduotis perkelia į asistento rankas — be sudėtingų zapierių.",
    },
    {
      icon: BarChart3,
      title: "Analizė",
      body: "Excel, Google Sheets, PDF — viskas paverčiama įžvalgomis per kelias minutes.",
    },
  ];

  return (
    <section className="px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <h2
          className="text-balance text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl md:text-[44px]"
          style={serifStyle}
        >
          Ką <HighlightedItalic marker={false}>konkrečiai</HighlightedItalic>{" "}
          jis daro.
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Keturios pagrindinės sritys, kuriose AI asistentas dirba už tave — nuo
          pirmos sesijos iki paskutinio mokestinio pranešimo.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {pillars.map((p) => (
            <Card
              key={p.title}
              className="rounded-2xl border-border/60 p-5 sm:p-6"
            >
              <div
                aria-hidden
                className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary"
              >
                <p.icon className="size-5" />
              </div>
              <h3
                className="mt-4 text-lg font-semibold sm:text-xl"
                style={serifStyle}
              >
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {p.body}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── 11. Urgency intro ───────────────────── */

function UrgencyIntroSection() {
  return (
    <section className="px-4 pt-2 pb-8 sm:px-6 sm:pt-4 sm:pb-12">
      <div className="mx-auto max-w-2xl text-center">
        <h2
          className="text-balance text-3xl font-medium leading-[1.05] tracking-tight sm:text-4xl md:text-[44px]"
          style={serifStyle}
        >
          AI juda <HighlightedItalic>žaibišku</HighlightedItalic> greičiu.
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Kiekvieną mėnesį atsiranda nauji modeliai, geresni įrankiai, naujos
          galimybės. Tie, kurie pradeda dabar — turi pranašumą metams į priekį.
        </p>
      </div>
    </section>
  );
}

/* ───────────────────── 12. PRIMARY PRICING BOX ───────────────────── */

function PrimaryPricingSection() {
  const valueStack = [
    { item: "Video pamoka „AI nuo nulio“ (~30 min.)", worth: "97 €" },
    { item: "5 paruošti AI darbo workflow'ai", worth: "97 €" },
    { item: "AI Studijos bendruomenė (Skool)", worth: "47 €" },
    { item: "Email naujienlaiškis · savaitiniai patarimai", worth: "29 €" },
    { item: "Atnaujinimai amžinai", worth: "30 €" },
  ];

  return (
    <section
      id="kaina"
      className="bg-foreground px-4 py-14 text-background sm:px-6 sm:py-20"
    >
      <div className="mx-auto max-w-2xl">
        <Badge className="rounded-full bg-foreground px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-background hover:bg-foreground">
          Pilnas paketas
        </Badge>
        <h2
          className="mt-4 text-balance text-3xl font-medium leading-[1.05] tracking-tight sm:text-4xl md:text-[44px]"
          style={serifStyle}
        >
          Viskas, ko reikia,{" "}
          <HighlightedItalic>vienoje vietoje.</HighlightedItalic>
        </h2>

        {/* Product mockup — the actual box buyer gets */}
        <div className="mt-6 overflow-hidden rounded-2xl bg-background/5">
          <Image
            src="/product.png"
            alt="AI Asistento gido produkto vaizdas"
            width={1536}
            height={1024}
            className="w-full"
          />
        </div>

        <Card className="mt-8 overflow-hidden rounded-3xl border-background/15 bg-background/10 p-6 text-background sm:p-8">
          <div className="flex items-center gap-2">
            <Badge className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary">
              {c.product.discountLabel}
            </Badge>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-background/70">
              Ribotas pasiūlymas
            </p>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <p
              className="text-5xl font-medium leading-none text-background sm:text-6xl"
              style={serifStyle}
            >
              {c.product.price} €
            </p>
            <p
              className="text-2xl text-background/50 line-through sm:text-3xl"
              style={serifStyle}
            >
              {c.product.originalPrice} €
            </p>
          </div>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-background/70">
            Vienkartinis mokėjimas
          </p>

          <ul className="mt-6 space-y-2.5">
            {valueStack.map((v) => (
              <li
                key={v.item}
                className="flex items-start justify-between gap-3 text-sm leading-relaxed sm:text-base"
              >
                <div className="flex items-start gap-2.5">
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-primary"
                    aria-hidden
                  />
                  <span className="text-background/90">{v.item}</span>
                </div>
                <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-background/60">
                  {v.worth}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-2xl border border-primary/40 bg-primary/15 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
              Bendra vertė
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <p
                className="text-3xl font-medium text-background sm:text-4xl"
                style={serifStyle}
              >
                270+ €
              </p>
              <p className="text-sm text-background/70">
                tavo kaina {c.product.price} €
              </p>
            </div>
          </div>

          {/* TODO: scarcity bar — wire'ink į Supabase pirkėjų skaičių prieš įjungiant */}

          <Link
            href={c.checkoutHref}
            className={buttonVariants({
              size: "lg",
              variant: "secondary",
              className:
                "mt-6 h-14 w-full justify-between rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold uppercase tracking-wider sm:text-base",
            })}
          >
            <span>Pirkti dabar · {c.product.price} €</span>
            <ArrowRight className="size-5" aria-hidden />
          </Link>

          <div className="mt-5 grid grid-cols-2 gap-3 text-xs text-background/80">
            <div className="flex items-center gap-2">
              <Lock className="size-4 text-primary" aria-hidden />
              <span>Saugus mokėjimas</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" aria-hidden />
              <span>14 d. garantija</span>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

/* ───────────────────── 13. "Ar atpažįsti save?" personas ───────────────────── */

function PersonaSection() {
  const personas = [
    {
      icon: TrendingUp,
      title: "Verslininkas",
      body: "Vystai kelis projektus vienu metu ir tau reikia trečios rankos.",
    },
    {
      icon: Sparkles,
      title: "Marketingistas",
      body: "Kampanijos, copy, briefai — kasdien po dešimt užduočių.",
    },
    {
      icon: Settings2,
      title: "Freelanceris",
      body: "Klientai jau klausia: „o tu dirbi su AI?“ Laikas rimtam atsakymui.",
    },
    {
      icon: Clock,
      title: "Biuro darbuotojas",
      body: "Pasikartojantys laiškai ir ataskaitos suvalgo geriausią dienos dalį.",
    },
    {
      icon: Users,
      title: "Komandos vadovas",
      body: "Reikia daugiau rezultatų iš tos pačios komandos — be perdegimo.",
    },
    {
      icon: Zap,
      title: "Startuolis",
      body: "Mažas biudžetas, dideli planai. AI tampa tavo papildomu žmogumi.",
    },
    {
      icon: Brain,
      title: "Bandei ChatGPT",
      body: "Užduodi klausimą, gauni atsakymą. Bet darbų jis už tave nedaro.",
    },
    {
      icon: Shield,
      title: "Neturi techninių žinių",
      body: "Niekada negirdėjai apie API. Ir nereikia — viskas paaiškinta paprastai.",
    },
  ];

  return (
    <section className="px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <h2
          className="text-balance text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl md:text-[44px]"
          style={serifStyle}
        >
          Ar <HighlightedItalic marker={false}>atpažįsti</HighlightedItalic>{" "}
          save?
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Gidas pritaikytas 8 skirtingoms situacijoms — visi pavyzdžiai
          praktiški, nepriklauso nuo tavo srities.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {personas.map((p) => (
            <Card
              key={p.title}
              className="flex flex-row items-start gap-4 rounded-2xl border-border/60 p-5"
            >
              <div
                aria-hidden
                className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
              >
                <p.icon className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold leading-tight">
                  {p.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {p.body}
                </p>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <CTABand
            href={c.checkoutHref}
            label={`Gauti gidą · ${c.product.price} €`}
            subtitle="14 dienų pinigų grąžinimo garantija · saugus mokėjimas"
          />
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── 14. 14-day guarantee ───────────────────── */

function GuaranteeSection() {
  return (
    <section className="bg-muted/40 px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full border-2 border-primary text-primary">
          <ShieldCheck className="size-10" aria-hidden />
        </div>
        <h2
          className="mt-6 text-balance text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl md:text-[44px]"
          style={serifStyle}
        >
          14 dienų{" "}
          <HighlightedItalic marker={false}>pinigų grąžinimo</HighlightedItalic>{" "}
          garantija.
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-foreground/80 sm:text-base">
          Pažiūrėk video, atsisiųsk promptų biblioteką, prisijunk prie
          bendruomenės. Jei per 14 dienų nepasieksi nė vieno realaus rezultato —
          grąžiname visus pinigus. Be klausimų, be smulkaus šrifto, be formų
          pildymo. Vienas el. laiškas — pinigai grįžta per 3 d.
        </p>

        <div className="mt-8">
          <Link
            href={c.checkoutHref}
            className={buttonVariants({
              size: "lg",
              className:
                "h-14 w-full justify-center rounded-2xl text-sm font-semibold uppercase tracking-wider sm:text-base",
            })}
          >
            Pradėti be rizikos · {c.product.price} €
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── 15. FAQ ───────────────────── */

function FAQSection() {
  const faqs = [
    {
      q: "Ką tiksliai gausiu už 47 €?",
      a: "Video pamoką (~30 min.) su realiais pavyzdžiais, PDF setup'o gidą (žingsnis po žingsnio), 5 paruoštus AI darbo workflow'us (klientų el. paštai, savaitės ataskaitos, idėjos į planą, klientų pasiūlymai, pasikartojančių darbų automatizavimas), nemokamą prieigą prie AI Studijos Skool bendruomenės ir atnaujinimus amžinai. Vienkartinė kaina.",
    },
    {
      q: "Ar reikia programavimo žinių?",
      a: "Ne. Gidas skirtas žmonėms be programavimo patirties. Su AI kalbėsi paprasta lietuvių kalba — lygiai taip pat, kaip rašai kolegai.",
    },
    {
      q: "Kiek laiko užtruks pradėti naudoti?",
      a: "30 minučių iki pirmo veikiančio rezultato. Video struktūra paprasta: žiūri, atkartoji, naudoji. Promptų biblioteką gali atsisiųsti ir pradėti naudoti dar prieš pasibaigiant video.",
    },
    {
      q: "Ar veiks su Mac ir Windows?",
      a: "Taip. Visi gido pavyzdžiai veikia abiejose sistemose. Naudojame įrankius, kurie prieinami iš naršyklės — nieko diegti nereikia.",
    },
    {
      q: "Ar reikia papildomai mokėti už AI?",
      a: "Pradžiai pakanka nemokamų versijų. Jei norėsi rimtesnių rezultatų, rekomenduojame Claude arba ChatGPT prenumeratą (~20 $/mėn.) — tai atskiras mokestis. Gide paaiškiname, kada verta pereiti į mokamą versiją.",
    },
    {
      q: "Ar galiu pasidalinti gidu su kolega?",
      a: "Vienas pirkimas — viena licencija. Jei norite naudoti komandai, susisiek su mumis dėl komandinės licencijos su nuolaida.",
    },
    {
      q: "Ar gausiu sąskaitą faktūrą įmonei?",
      a: "Taip. Po pirkimo automatiškai išsiunčiame PDF sąskaitą tavo nurodytu el. paštu. Tinka įmonės buhalterijai.",
    },
    {
      q: "Kaip veikia 14 dienų garantija?",
      a: "Per 14 dienų po pirkimo gali parašyti mums vieną el. laišką ir grąžinsime visus pinigus per 3 darbo dienas. Be klausimų, be formų.",
    },
    {
      q: "Ar bus atnaujinimų?",
      a: "Taip. Kai pasirodo nauji AI įrankiai ar geresni metodai, gidą atnaujiname — o tu gauni naują versiją be papildomo mokesčio.",
    },
    {
      q: "O jei pasimes, ką daryti?",
      a: "Visada gali parašyti į bendruomenę arba el. paštu — atsakome per parą. Šio gido tikslas, kad tu pasiektum rezultatą, ne kad nusipirktum ir pamirštum.",
    },
  ];

  return (
    <section className="px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <h2
          className="text-balance text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl md:text-[44px]"
          style={serifStyle}
        >
          Dažniausi{" "}
          <HighlightedItalic marker={false}>klausimai.</HighlightedItalic>
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Jei neradai atsakymo — užpildyk{" "}
          <Link href="/kontaktai" className="underline underline-offset-2">
            kontaktinę formą
          </Link>
          . Atsakome per parą.
        </p>

        <Accordion className="mt-6 space-y-3">
          {faqs.map((item, idx) => (
            <AccordionItem
              key={item.q}
              value={`faq-${idx}`}
              className="overflow-hidden rounded-2xl border border-border/60 bg-card"
            >
              <AccordionTrigger className="px-5 py-4 text-left text-sm font-semibold hover:no-underline sm:text-base">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

/* ───────────────────── 16. Final dark CTA ───────────────────── */

function FinalCTASection() {
  return (
    <section className="bg-foreground px-4 py-14 text-background sm:px-6 sm:py-24">
      <div className="mx-auto max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          Paskutinis žingsnis
        </p>
        <h2
          className="mt-3 text-balance text-3xl font-medium leading-[1.05] tracking-tight sm:text-4xl md:text-[44px]"
          style={serifStyle}
        >
          {c.product.price} € investicija. Asistentas{" "}
          <HighlightedItalic marker={false}>visam gyvenimui.</HighlightedItalic>
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-background/80 sm:text-base">
          Vienkartinė kaina. Jokių mėnesinių mokesčių, jokių paslėptų sąlygų.
          Video, PDF gidas, 5 darbo workflow&apos;ai, bendruomenė, atnaujinimai
          — viskas tavo, kol naudosi AI. Pradėk šiandien, sutaupyk 2 valandas
          jau rytoj.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href={c.checkoutHref}
            className={buttonVariants({
              size: "lg",
              variant: "secondary",
              className:
                "h-14 w-full justify-between rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold uppercase tracking-wider sm:text-base",
            })}
          >
            <span>Gauti gidą · {c.product.price} €</span>
            <ArrowRight className="size-5" aria-hidden />
          </Link>
          <div className="grid grid-cols-2 gap-3 text-xs text-background/80">
            <div className="flex items-center justify-center gap-2 rounded-xl border border-background/15 bg-background/10 px-3 py-2.5">
              <Lock className="size-4 text-primary" aria-hidden />
              <span>Saugus mokėjimas</span>
            </div>
            <div className="flex items-center justify-center gap-2 rounded-xl border border-background/15 bg-background/10 px-3 py-2.5">
              <ShieldCheck className="size-4 text-primary" aria-hidden />
              <span>14 d. garantija</span>
            </div>
          </div>
        </div>

        {/* TODO: jei norėsi misiją + skaitiklį — užpildyk tikrais duomenimis.
            Pavyzdys: „Iki 2027 m. pabaigos išmokyti X lietuvių...“ + tikras pirkėjų skaičius. */}
      </div>
    </section>
  );
}
