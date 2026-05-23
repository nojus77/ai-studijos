import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Check,
  Clock,
  Lock,
  MessageSquare,
  Play,
  Settings2,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

import { CTABand } from "@/components/cta-band";
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
    <section className="px-4 pb-14 pt-10 sm:px-6 sm:pt-14">
      <div className="mx-auto max-w-2xl">
        <Badge className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary hover:bg-primary/10">
          AI Studijos · {c.product.price} €
        </Badge>

        <h1
          className="mt-5 text-balance text-[36px] font-medium leading-[1.05] tracking-tight sm:text-[48px] md:text-[56px]"
          style={serifStyle}
        >
          Tavo asmeninis <HighlightedItalic>AI asistentas</HighlightedItalic>{" "}
          per 30 minučių.
        </h1>

        <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
          Vienas video. Viena PDF biblioteka. Visam gyvenimui. Sužinosi, kaip
          pradėti naudoti AI taip, kad jis tau atneštų bent 2 valandas kiekvieną
          dieną — be programavimo, be sudėtingų įrankių, be tuščių teorijų. Tik
          tai, kas veikia šiandien.
        </p>

        {/* Video thumbnail with play button */}
        <div className="mt-7 overflow-hidden rounded-2xl border border-border/60">
          {/* TODO: replace with real video thumbnail */}
          <div className="relative aspect-video bg-foreground" aria-hidden>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                aria-label="Paleisti įvadinį video"
                className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition hover:scale-105"
              >
                <Play className="ml-1 size-7 fill-current" aria-hidden />
              </button>
            </div>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-background/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-foreground">
              Pažiūrėk 90 sek.
            </div>
          </div>
        </div>

        {/* Social proof avatar row */}
        <div className="mt-7 flex items-center gap-4">
          <div className="flex -space-x-2">
            {[0, 1, 2, 3, 4].map((i) => (
              // TODO: replace with real student avatars
              <div
                key={i}
                aria-hidden
                className="size-9 rounded-full border-2 border-background bg-muted"
              />
            ))}
          </div>
          <div>
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star
                  key={i}
                  className="size-3.5 fill-primary text-primary"
                  aria-hidden
                />
              ))}
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              500+ lietuvių jau pradėjo
            </p>
          </div>
        </div>

        {/* Primary CTA */}
        <div className="mt-7">
          <Link
            href={c.checkoutHref}
            className={buttonVariants({
              size: "lg",
              className:
                "h-14 w-full justify-between rounded-2xl text-sm font-semibold uppercase tracking-wider sm:text-base",
            })}
          >
            <span>Gauti gidą · {c.product.price} €</span>
            <ArrowRight className="size-5" aria-hidden />
          </Link>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Vienkartinis mokėjimas · prieiga akimirksniu
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
      title: "El. paštai per 5 min., ne 45.",
      body: "AI atsako į rutininius laiškus tavo stiliumi, o tu tik patvirtini.",
    },
    {
      icon: BarChart3,
      title: "Ataskaitos pačios susidėlioja.",
      body: "Mėnesio ataskaita iš Excel ar Google Sheets — be kopijavimo rankomis.",
    },
    {
      icon: Brain,
      title: "Mintys į planą per minutę.",
      body: "Pasakai idėją balsu, AI paverčia ją struktūruotu žingsnių sąrašu.",
    },
    {
      icon: Zap,
      title: "Įprastos užduotys — automatiškai.",
      body: "Pasikartojančius darbus AI atlieka fone, kol tu užsiimi svarbiausiais.",
    },
  ];

  return (
    <section className="bg-muted/40 px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <h2
          className="text-balance text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl md:text-[44px]"
          style={serifStyle}
        >
          Sutaupyk <HighlightedItalic>2 valandas</HighlightedItalic> kiekvieną
          dieną.
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Tai ne pažadas iš debesų — tai vidurkis, kurį pasiekia žmonės jau po
          pirmos savaitės. Štai 4 konkretūs darbai, kuriuos AI perima vos tik
          perskaitai gidą.
        </p>

        <div className="mt-8 space-y-3">
          {bullets.map((b) => (
            <Card
              key={b.title}
              className="flex flex-row items-start gap-4 rounded-2xl border-border/60 p-5 sm:p-6"
            >
              <div
                aria-hidden
                className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
              >
                <b.icon className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold sm:text-lg">
                  {b.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {b.body}
                </p>
              </div>
            </Card>
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
    "PDF promptų biblioteka (50+ paruoštų)",
    "Nemokama prieiga prie AI Studijos bendruomenės",
    "Atnaujinimai amžinai — be papildomų mokesčių",
  ];

  return (
    <section id="kaina-teaser" className="px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <Card className="overflow-hidden rounded-3xl border-border/60 p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <Badge className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary">
              {c.product.discountLabel}
            </Badge>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Ribotas pasiūlymas
            </p>
          </div>

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
            Vienkartinis mokėjimas
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
            Saugus mokėjimas · 14 dienų pinigų grąžinimo garantija
          </p>
        </Card>
      </div>
    </section>
  );
}

function ScarcityBar() {
  const pct = Math.round((c.scarcity.taken / c.scarcity.total) * 100);
  return (
    <div className="mt-6 rounded-2xl bg-muted p-4">
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="uppercase tracking-[0.14em] text-foreground">
          {/* TODO: wire to Supabase count */}
          {c.scarcity.taken}/{c.scarcity.total} vietų užimta
        </span>
        <span className="text-primary">{pct}%</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-background">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${pct}%` }}
          aria-hidden
        />
      </div>
    </div>
  );
}

/* ───────────────────── 4. Stats Grid (2×2) ───────────────────── */

function StatsGridSection() {
  const stats = [
    { value: "30", label: "Minučių iki rezultato" },
    { value: "0", label: "Reikia programavimo" },
    { value: "∞", label: "Prieiga visam gyvenimui" },
    { value: "24/7", label: "Asistentas dirba" },
  ];

  return (
    <section className="bg-background px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {stats.map((s) => (
            <Card
              key={s.label}
              className="rounded-2xl border-foreground/10 bg-foreground p-5 text-center text-background sm:p-7"
            >
              <p
                className="text-4xl font-medium leading-none sm:text-5xl"
                style={serifStyle}
              >
                {s.value}
              </p>
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-background/70">
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
        <Badge className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary hover:bg-primary/10">
          Kelionės pradžia
        </Badge>
        <h2
          className="mt-4 text-balance text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl md:text-[44px]"
          style={serifStyle}
        >
          Kol tu galvoji, <HighlightedItalic>kiti jau daro.</HighlightedItalic>
        </h2>

        <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-foreground/90 sm:text-base">
          <p>
            <span
              className="float-left mr-2 text-5xl leading-[0.85] text-primary sm:text-6xl"
              style={serifStyle}
            >
              P
            </span>
            rieš metus ir mes patys nežinojom, kur viskas eina. Stebėjom, kaip
            kolegos sėdi po 12 valandų prie ekrano ir vis tiek nespėja. Tada
            pradėjom statyti savo AI asistentus — vieną darbą po kito,
            paprastai, be programavimo.
          </p>
          <p>
            Šiandien tas pats AI mums paruošia rinkodaros strategijas, rašo
            klientų laiškus, daro mėnesių ataskaitas, sutvarko buhalterijos
            dokumentus ir net atsakymus į komentarus po socialinių tinklų
            įrašais. Realiai 80 % rutinos atlieka jis, o mes susitelkiame į
            strategiją.
          </p>
          <p>
            Šiame gide surinkome viską, ką pasimokėme per pastaruosius metus —
            be jokio fluff. Tik konkrečios komandos, paruošti promptai ir video,
            kuriame parodome viską nuo nulio.
          </p>
          <p className="text-muted-foreground">
            Jei turi klausimų — rašyk{" "}
            <a
              className="underline underline-offset-2"
              href={`mailto:${c.contactEmail}`}
            >
              {c.contactEmail}
            </a>
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
  const testimonials = [
    {
      name: "Tomas Z.",
      role: "NT investicijų vadovas",
      excerpt: "Per savaitę atsigavau 12 valandų. Daugiau nesvarstau.",
    },
    {
      name: "Greta M.",
      role: "Freelance copywriter",
      excerpt: "Klientams atsakymai dabar paruošti per 5 minutes.",
    },
    {
      name: "Mantas P.",
      role: "Smulkaus verslo savininkas",
      excerpt: "Mėnesio ataskaita pati susikuria. Anksčiau — pusė dienos.",
    },
    {
      name: "Akvilė R.",
      role: "Marketingo vadovė",
      excerpt: "Kampanijų briefai per 10 min., ne 2 valandas.",
    },
    {
      name: "Dovydas K.",
      role: "Projektų vadovas",
      excerpt: "AI dabar tvarko mano kalendorių geriau nei aš pats.",
    },
  ];

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
          Pažiūrėk, kaip lietuviai naudoja gidą jau šiandien. Visi vaizdo
          atsiliepimai — iš realių pirkėjų, be aktorių.
        </p>

        <p className="mt-6 text-xs italic text-muted-foreground">
          (Placeholder — pakeisk su tikrais vaizdo atsiliepimais kai turėsi.)
        </p>

        <div className="mt-4 space-y-4">
          {testimonials.map((t) => (
            <Card
              key={t.name}
              className="overflow-hidden rounded-2xl border-border/60 p-0"
            >
              {/* TODO: replace with real portrait video thumbnail */}
              <div
                className="relative aspect-[4/5] bg-foreground sm:aspect-video"
                aria-hidden
              >
                <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/60 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    type="button"
                    aria-label={`Paleisti ${t.name} atsiliepimą`}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition hover:scale-105"
                  >
                    <Play className="ml-0.5 size-6 fill-current" aria-hidden />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-background">
                  <p
                    className="text-base font-medium leading-snug sm:text-lg"
                    style={serifStyle}
                  >
                    „{t.excerpt}“
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <div
                      className="size-8 rounded-full bg-background/20"
                      aria-hidden
                    />
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-[10px] uppercase tracking-wider text-background/70">
                        {t.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── 7. Dark "Kodėl dabar?" market stats ───────────────────── */

function MarketStatsSection() {
  return (
    <section className="bg-foreground px-4 py-14 text-background sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <Badge className="rounded-full bg-primary/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary hover:bg-primary/20">
          Kodėl dabar?
        </Badge>

        <h2
          className="mt-4 text-balance text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl md:text-[44px]"
          style={serifStyle}
        >
          AI rinka auga <HighlightedItalic>15 kartų</HighlightedItalic> per 2
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
  // TODO: replace with real Skool reviews
  const reviews = [
    {
      name: "Lina V.",
      role: "Buhalterė",
      stars: 5,
      text: "Visi mano ataskaitų šablonai jau dirba. Pirmas pirkimas, kurio negailiu.",
    },
    {
      name: "Edvinas T.",
      role: "Startuolio CTO",
      stars: 5,
      text: "Praktikoje pritaikoma akimirksniu. Bendruomenė padeda, kai užstringi.",
    },
    {
      name: "Rasa B.",
      role: "Personalo vadovė",
      stars: 5,
      text: "Per 2 dienas išsprendžiau problemą, kurią vilkau pusmetį.",
    },
    {
      name: "Gintaras J.",
      role: "Konsultantas",
      stars: 5,
      text: "Promptų biblioteka verta dvigubai daugiau už visą gidą.",
    },
    {
      name: "Karolis D.",
      role: "Project Manager",
      stars: 5,
      text: "Aiškiausias AI vadovas, kurį esu skaitęs lietuviškai.",
    },
  ];

  return (
    <section className="bg-muted/40 px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <Badge className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary hover:bg-primary/10">
          AI Studijos bendruomenė
        </Badge>
        <h2
          className="mt-4 text-balance text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl md:text-[44px]"
          style={serifStyle}
        >
          500+ lietuvių jau{" "}
          <HighlightedItalic>dirba kartu su AI.</HighlightedItalic>
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Įsigijęs gidą automatiškai gauni prieigą prie privačios{" "}
          {c.community.platform} bendruomenės — kur dalinamės naujais promptais,
          pavyzdžiais ir pagalba.
        </p>

        <div className="mt-8 space-y-3">
          {reviews.map((r) => (
            <Card
              key={r.name}
              className="rounded-2xl border-border/60 p-5 sm:p-6"
            >
              <div className="flex items-center gap-1">
                {Array.from({ length: r.stars }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-3.5 fill-primary text-primary"
                    aria-hidden
                  />
                ))}
              </div>
              <p
                className="mt-3 text-sm leading-relaxed text-foreground/85 sm:text-base"
                style={serifStyle}
              >
                „{r.text}“
              </p>
              <div className="mt-4 flex items-center gap-3">
                {/* TODO: replace with real user avatar */}
                <div
                  className="size-9 shrink-0 rounded-full bg-muted"
                  aria-hidden
                />
                <div>
                  <p className="text-sm font-semibold leading-tight">
                    {r.name}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {r.role}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
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
          Ką <HighlightedItalic>konkrečiai</HighlightedItalic> jis daro.
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
    { item: "PDF promptų biblioteka (50+ paruoštų)", worth: "67 €" },
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
        <Badge className="rounded-full bg-primary/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary hover:bg-primary/20">
          Pilnas paketas
        </Badge>
        <h2
          className="mt-4 text-balance text-3xl font-medium leading-[1.05] tracking-tight sm:text-4xl md:text-[44px]"
          style={serifStyle}
        >
          Viskas, ko reikia,{" "}
          <HighlightedItalic>vienoje vietoje.</HighlightedItalic>
        </h2>

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

          {/* Scarcity bar (dark variant) */}
          <div className="mt-6 rounded-2xl bg-background/10 p-4">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="uppercase tracking-[0.14em] text-background">
                {/* TODO: wire to Supabase count */}
                {c.scarcity.taken}/{c.scarcity.total} vietų užimta
              </span>
              <span className="text-primary">
                {Math.round((c.scarcity.taken / c.scarcity.total) * 100)}%
              </span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-background/15">
              <div
                className="h-full rounded-full bg-primary"
                style={{
                  width: `${Math.round(
                    (c.scarcity.taken / c.scarcity.total) * 100,
                  )}%`,
                }}
                aria-hidden
              />
            </div>
          </div>

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
          Ar <HighlightedItalic>atpažįsti</HighlightedItalic> save?
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
          14 dienų <HighlightedItalic>pinigų grąžinimo</HighlightedItalic>{" "}
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
      a: "Vieną video pamoką (~30 min.), PDF promptų biblioteką su 50+ paruoštų komandų, nemokamą prieigą prie AI Studijos Skool bendruomenės ir savaitinį naujienlaiškį su naujais patarimais. Viskas — vienkartinė kaina, prieiga visam gyvenimui.",
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
          Dažniausi <HighlightedItalic>klausimai.</HighlightedItalic>
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Jei neradai atsakymo — rašyk{" "}
          <a
            className="underline underline-offset-2"
            href={`mailto:${c.contactEmail}`}
          >
            {c.contactEmail}
          </a>
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
          <HighlightedItalic>visam gyvenimui.</HighlightedItalic>
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-background/80 sm:text-base">
          Vienkartinė kaina. Jokių mėnesinių mokesčių, jokių paslėptų sąlygų.
          Vienas video, viena PDF biblioteka, bendruomenė, atnaujinimai — viskas
          tavo, kol naudosi AI. Pradėk šiandien, sutaupyk 2 valandas jau rytoj.
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

        <div className="mt-12 border-t border-background/20 pt-8">
          <p
            className="text-balance text-lg leading-snug text-background/85 sm:text-xl"
            style={serifStyle}
          >
            Mūsų tikslas: iki 2026 m. pabaigos išmokyti 50 000 lietuvių
            išnaudoti AI iki paties didžiausio jo potencialo, ne tik ChatGPT.
          </p>
          <p
            className="mt-6 bg-gradient-to-r from-primary to-background bg-clip-text text-5xl font-medium text-transparent sm:text-7xl"
            style={serifStyle}
          >
            500+
          </p>
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-background/70">
            jau pradėjo. Ar tu prisijungsi?
          </p>
        </div>
      </div>
    </section>
  );
}
