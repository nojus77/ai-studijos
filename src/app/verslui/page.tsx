import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Check, Users, Wrench } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Mokymai komandai · AI Studijos",
  description:
    "Atvažiuojame į tavo biurą ir per vieną dieną pastatome komandai veikiančią AI sistemą — agentai, automatizacijos, įgūdžiai. Be teorijos, su realiais darbais.",
};

const serifStyle = { fontFamily: "var(--font-serif)" } as const;
const CONTACT_EMAIL = "labas@aistudijos.lt";

export default function VerslulPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <ProblemSection />
        <WhatWeDoSection />
        <ProcessSection />
        <SocialProofSection />
        <LeadFormSection />
        <FAQSection />
      </main>
      <SiteFooter />
    </>
  );
}

/* ───────────────────── 1. Hero ───────────────────── */

function HeroSection() {
  return (
    <section className="px-4 pb-12 pt-10 sm:px-6 sm:pt-14">
      <div className="mx-auto max-w-2xl">
        <Badge className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary hover:bg-primary/10">
          Mokymai komandai
        </Badge>
        <h1
          className="mt-4 text-balance text-[36px] font-medium leading-[1.05] tracking-tight sm:text-[48px] md:text-[56px]"
          style={serifStyle}
        >
          Per vieną dieną tavo komanda{" "}
          <HighlightedItalic>pradeda dirbti</HighlightedItalic> su AI.
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
          Atvažiuojame pas jus į biurą. Pasikalbam su kiekvienu darbuotoju, ką
          jis daro kasdien, ir tiesiogiai prie jo kompiuterio pastatome AI
          agentus bei automatizacijas, kurie nuima rutinos darbus. Po vienos
          dienos komanda turi ne pristatymą apie AI, o veikiančią sistemą, kurią
          naudoja nuo kitos darbo dienos ryto.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="#uzklausa"
            className={buttonVariants({
              size: "lg",
              className:
                "h-12 w-full rounded-full text-sm font-semibold uppercase tracking-wider",
            })}
          >
            Užsisakyti pokalbį
          </Link>
          <Link
            href="#kaip-vyksta"
            className={buttonVariants({
              size: "lg",
              variant: "outline",
              className:
                "h-12 w-full rounded-full text-sm font-semibold uppercase tracking-wider",
            })}
          >
            Kaip viskas vyksta
          </Link>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          <HeroStat top="1 d." bottom="Vizitas biure" />
          <HeroStat top="30 d." bottom="Follow-up palaikymas" emphasis />
          <HeroStat top="0" bottom="Programavimo žinių" />
        </div>
      </div>
    </section>
  );
}

function HeroStat({
  top,
  bottom,
  emphasis,
}: {
  top: string;
  bottom: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 p-5 text-center sm:p-6",
        emphasis
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-card text-foreground",
      )}
    >
      <p
        className="text-3xl font-medium leading-none sm:text-4xl"
        style={serifStyle}
      >
        {top}
      </p>
      <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] opacity-80">
        {bottom}
      </p>
    </div>
  );
}

/* ───────────────────── 2. Problem ───────────────────── */

function ProblemSection() {
  const pains = [
    "Komanda jau bandė ChatGPT, bet 80 % laiko sugaišta tas pats: paaiškina kontekstą, kopijuoja duomenis, taiso rezultatą. Realaus efektyvumo augimo nematyti.",
    "Kiekvienas darbuotojas naudoja AI savaip. Vieni nieko, kiti per dieną — bet niekas nesidalina, kas veikia. Žinios nesusikaupia kaip įmonės turtas.",
    "Vadovai jaučia, kad AI yra galimybė, bet niekas viduje neturi laiko ir patirties paimti, sustatyti procesus ir apmokyti komandą. Dokumentų skaitymas neveikia.",
  ];

  return (
    <section className="bg-muted/40 px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <h2
          className="text-balance text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl"
          style={serifStyle}
        >
          Tavo komanda mėgina naudoti ChatGPT, bet{" "}
          <HighlightedItalic>80 % laiko</HighlightedItalic> praleidžia tas pats.
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Skirtingose įmonėse matome tą patį vaizdą. Tris pasikartojančias
          problemas, kurios stabdo komandą.
        </p>

        <div className="mt-8 space-y-4">
          {pains.map((pain, idx) => (
            <Card
              key={pain}
              className="flex flex-row items-start gap-4 rounded-2xl border-border/60 p-5 sm:p-6"
            >
              <span
                className="text-2xl font-medium leading-none text-primary"
                style={serifStyle}
              >
                {(idx + 1).toString().padStart(2, "0")}
              </span>
              <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
                {pain}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── 3. What we do ───────────────────── */

function WhatWeDoSection() {
  const cards = [
    {
      icon: Building2,
      title: "Vizitas pas jus į biurą",
      body: "Visa diena su komanda gyvai. Be Zoom, be teorijos. Sėdam šalia kiekvieno darbuotojo, suprantam jo darbo srautą ir paleidžiam AI tiesiai jo kompiuteryje.",
    },
    {
      icon: Wrench,
      title: "Custom AI agentų setup",
      body: "Pagal jūsų realius procesus pastatome agentus, kurie tvarko el. paštą, ruošia pasiūlymus, dirba su Excel, susijungia su jūsų CRM ar buhalterijos sistema.",
    },
    {
      icon: Users,
      title: "30 d. follow-up palaikymas",
      body: "Po vizito likusios 4 savaitės — esame ranka pasiekiami. Klausimai, papildomi įgūdžiai, problemų sprendimas. Komanda tikrai pradeda dirbti, ne tik išmoksta.",
    },
  ];

  return (
    <section className="px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <h2
          className="text-balance text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl"
          style={serifStyle}
        >
          Ką <HighlightedItalic>darome</HighlightedItalic> jūsų komandai.
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Tris dalykus, kurie kartu virsta veikiančia AI sistema visai komandai
          — ne teoriniu seminaru, kurį po savaitės visi pamiršta.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-1">
          {cards.map((c) => (
            <Card
              key={c.title}
              className="rounded-2xl border-border/60 p-6 sm:p-7"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <c.icon className="size-5" aria-hidden />
              </div>
              <h3
                className="mt-4 text-lg font-semibold sm:text-xl"
                style={serifStyle}
              >
                {c.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {c.body}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── 4. Process ───────────────────── */

function ProcessSection() {
  const steps = [
    {
      n: "01",
      title: "Pokalbis 30 min",
      body: "Susiskambinam. Pasidalini komandos dydžiu, sritimi ir kokius darbus norėtum automatizuoti. Aš jau pateikiu konkrečių idėjų, kas tinka ir kas ne.",
    },
    {
      n: "02",
      title: "Vizitas pas tave",
      body: "Sutariam datą. Atvažiuoju į jūsų biurą su pasiruošta darbotvarke pagal komandos sritį. Iš anksto suderiname, kokius įrankius jau naudojate.",
    },
    {
      n: "03",
      title: "Setup ir workshop",
      body: "Visa diena su komanda. Ryte — bendras pristatymas ir bazė. Po pietų — individualus setup prie kiekvieno žmogaus kompiuterio. Pabaigai — demo, ką pasiekėme.",
    },
    {
      n: "04",
      title: "30 d. follow-up",
      body: "Likusias 4 savaites esame ranka pasiekiami: Slack/email klausimai, papildomi įgūdžiai, jeigu kažkas neveikia — sprendžiam kartu, ne paliekam vienus.",
    },
  ];

  return (
    <section
      id="kaip-vyksta"
      className="bg-muted/40 px-4 py-14 sm:px-6 sm:py-20"
    >
      <div className="mx-auto max-w-2xl">
        <h2
          className="text-balance text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl"
          style={serifStyle}
        >
          Kaip <HighlightedItalic>vyksta</HighlightedItalic>.
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Keturi žingsniai nuo pirmo pokalbio iki veikiančios sistemos jūsų
          komandoje. Be staigmenų ir be paslėptų etapų.
        </p>

        <div className="mt-8 space-y-4">
          {steps.map((s) => (
            <Card
              key={s.n}
              className="flex flex-row items-start gap-5 rounded-2xl border-border/60 p-5 sm:p-6"
            >
              <span
                className="text-4xl font-medium leading-none text-primary sm:text-5xl"
                style={serifStyle}
              >
                {s.n}
              </span>
              <div>
                <h3
                  className="text-lg font-semibold sm:text-xl"
                  style={serifStyle}
                >
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {s.body}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── 5. Social proof (placeholder) ───────────────────── */

function SocialProofSection() {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Mums pasitiki
        </p>
        <h2
          className="mt-3 text-balance text-2xl font-medium leading-[1.1] tracking-tight sm:text-3xl"
          style={serifStyle}
        >
          Komandos, kurios jau pradėjo dirbti su{" "}
          <HighlightedItalic>AI komanda viduje</HighlightedItalic>.
        </h2>

        {/* TODO: replace placeholder logo slots with real client logos */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex h-20 items-center justify-center rounded-2xl border border-border/60 bg-muted/40"
              aria-hidden
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Logo #{i}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs italic text-muted-foreground">
          (Placeholder — pakeisk su tikrų klientų logotipais kai turėsi
          pirmuosius rezultatus.)
        </p>
      </div>
    </section>
  );
}

/* ───────────────────── 6. Lead form ───────────────────── */

function LeadFormSection() {
  return (
    <section
      id="uzklausa"
      className="bg-foreground px-4 py-14 text-background sm:px-6 sm:py-20"
    >
      <div className="mx-auto max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          Užklausa
        </p>
        <h2
          className="mt-3 text-balance text-3xl font-medium leading-[1.05] tracking-tight sm:text-4xl"
          style={serifStyle}
        >
          Užpildyk anketą —{" "}
          <HighlightedItalic>perskambinsime</HighlightedItalic> per 1 d.d.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-background/80 sm:text-base">
          Kainoraščio nėra — kiekvienai komandai ruošiame individualų pasiūlymą.
          Pirmas pokalbis 30 min, be įsipareigojimų.
        </p>

        <form
          method="post"
          action="/api/leads"
          className="mt-8 space-y-4 rounded-3xl bg-background p-6 text-foreground sm:p-8"
        >
          <input type="hidden" name="source" value="verslui" />

          <div className="space-y-2">
            <Label htmlFor="vardas">Vardas *</Label>
            <Input
              id="vardas"
              name="vardas"
              type="text"
              required
              autoComplete="name"
              placeholder="Vardas Pavardenis"
              className="h-11 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imone">Įmonė</Label>
            <Input
              id="imone"
              name="imone"
              type="text"
              autoComplete="organization"
              placeholder="UAB Pavyzdys"
              className="h-11 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">El. paštas *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="vardas@imone.lt"
              className="h-11 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefonas">Telefonas</Label>
            <Input
              id="telefonas"
              name="telefonas"
              type="tel"
              autoComplete="tel"
              placeholder="+370"
              className="h-11 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="komandos_dydis">Komandos dydis</Label>
            <select
              id="komandos_dydis"
              name="komandos_dydis"
              defaultValue=""
              className="flex h-11 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="" disabled>
                Pasirink…
              </option>
              <option value="1-10">1–10 žmonių</option>
              <option value="11-50">11–50 žmonių</option>
              <option value="51-200">51–200 žmonių</option>
              <option value="200+">200+ žmonių</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="situacija">Aprašykite jūsų situaciją</Label>
            <Textarea
              id="situacija"
              name="situacija"
              rows={5}
              placeholder="Trumpai: ką daro jūsų komanda, kokie procesai užima daugiausia laiko, ko tikitės iš AI."
              className="rounded-xl"
            />
          </div>

          <button
            type="submit"
            className={buttonVariants({
              size: "lg",
              className:
                "h-12 w-full rounded-full text-sm font-semibold uppercase tracking-wider",
            })}
          >
            Užsisakyti pokalbį
            <ArrowRight className="ml-2 size-4" aria-hidden />
          </button>

          <p className="text-center text-xs text-muted-foreground">
            Atsakome per 1 darbo dieną. Be spamo.
          </p>
        </form>
      </div>
    </section>
  );
}

/* ───────────────────── 7. FAQ ───────────────────── */

function FAQSection() {
  const faqs = [
    {
      q: "Kiek tai kainuoja?",
      a: "Kaina priklauso nuo komandos dydžio ir norimų automatizacijų sudėtingumo. Po pirmo 30 min pokalbio paruošiame konkretų pasiūlymą per 2 d.d. Vienos dienos vizitas mažai komandai prasideda nuo kelių tūkstančių eurų.",
    },
    {
      q: "Kur vyksta mokymai?",
      a: "Atvažiuojame į jūsų biurą Lietuvoje. Vilnius, Kaunas, Klaipėda — be jokio papildomo mokesčio. Kituose miestuose pridedamos kelionės sąnaudos. Hibridiniam variantui (dalis komandos nuotoliu) — tinkam.",
    },
    {
      q: "Kiek laiko trunka?",
      a: "Pagrindinis darbas — viena pilna diena pas jus (8 val.). Iš jos: 2 val. bendras pristatymas, 4 val. individualus setup prie kiekvieno žmogaus kompiuterio, 2 val. demo ir klausimai. Po to 30 dienų follow-up palaikymas.",
    },
    {
      q: "Ar gausiame palaikymą po mokymų?",
      a: "Taip — 30 dienų po vizito esame ranka pasiekiami per Slack arba el. paštą. Atsakome į klausimus, padedame su naujais įgūdžiais, sprendžiame problemas. Ilgesnis palaikymas — kaip atskira paslauga.",
    },
    {
      q: "Ar reikia ko nors paruošti iš anksto?",
      a: "Beveik nieko. Užtenka, kad komandos kompiuteriuose būtų administratoriaus teisės įdiegti programas. Visa kita — Claude prenumeratos, įrankių pasirinkimai, integracijos — paruošiame patys arba aptariame iš anksto.",
    },
  ];

  return (
    <section className="bg-muted/40 px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <h2
          className="text-balance text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl"
          style={serifStyle}
        >
          Dažniausi <HighlightedItalic>klausimai</HighlightedItalic>.
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Jei neradai atsakymo — rašyk{" "}
          <a
            className="underline underline-offset-2"
            href={`mailto:${CONTACT_EMAIL}`}
          >
            {CONTACT_EMAIL}
          </a>
          .
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

        <div className="mt-10 rounded-2xl border border-primary bg-primary/5 p-6 text-center">
          <p className="text-sm font-semibold sm:text-base">
            Pasiruošę pasikalbėti?
          </p>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            30 min pokalbis, be įsipareigojimų. Užklausą atsakome per 1 d.d.
          </p>
          <Link
            href="#uzklausa"
            className={buttonVariants({
              size: "lg",
              className:
                "mt-4 h-12 w-full rounded-full text-sm font-semibold uppercase tracking-wider sm:w-auto sm:px-8",
            })}
          >
            Užsisakyti pokalbį
          </Link>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Check className="size-4 text-primary" aria-hidden />
          <span>Lietuviškai · be techninių terminų · su pavyzdžiais</span>
        </div>
      </div>
    </section>
  );
}
