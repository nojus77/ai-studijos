import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Crown, Mail, X } from "lucide-react";

import { Countdown } from "@/components/countdown";
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
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { bootcampContent as c } from "./_content";

export const metadata: Metadata = {
  title: "Mėnesinis AI Bootcamp",
  description:
    "Per 2 sekmadienio vakarus susikursi savo AI asistentą, kuris atgaus 15+ valandų per savaitę. 100 % online, jokio programavimo.",
};

const serifStyle = { fontFamily: "var(--font-serif)" } as const;

export default function BootcampPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <LaunchDateSection />
        <AudienceFitSection />
        <ProblemsSection />
        <LifestyleBenefitsSection />
        <CurriculumGridSection />
        <CurriculumDetailSection />
        <ToolComparisonSection />
        <PricingSection />
        <GuaranteeSection />
        <TestimonialsSection />
        <FAQSection />
        <EmailCaptureSection />
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
      <div className="mx-auto max-w-2xl">
        <h1
          className="text-balance text-[36px] font-medium leading-[1.05] tracking-tight sm:text-[48px] md:text-[56px]"
          style={serifStyle}
        >
          Per 2 sekmadienio vakarus susikursi{" "}
          <HighlightedItalic>savo</HighlightedItalic> AI asistentą.
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
          Bandei ChatGPT. Užduodi klausimą, gauni atsakymą. Bet realių darbų jis
          už tave nedaro: nesutvarko el. pašto, neparuošia ataskaitos,
          nesujungia Excelio. Bootcamp&apos;as yra būtent apie tai. 2 online
          susitikimai iš namų, biuro ar bet kurio Lietuvos kampelio. Kartu
          paruošiame AI asistentą tavo kompiuteryje, prijungiame jį prie el.
          pašto bei kitų programų, ir mokome jį dirbti būtent tavo darbus. Po
          Bootcamp&apos;o turi ne teoriją apie AI, o veikiančią sistemą, kuri
          atgauna tau 15+ valandų per savaitę.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="#kaina"
            className={buttonVariants({
              size: "lg",
              className:
                "h-12 w-full rounded-full text-sm font-semibold uppercase tracking-wider",
            })}
          >
            Prisijunk · {c.pricing.standard.price} €
          </Link>
          <Link
            href="#ar-tinka"
            className={buttonVariants({
              size: "lg",
              variant: "outline",
              className:
                "h-12 w-full rounded-full text-sm font-semibold uppercase tracking-wider",
            })}
          >
            Ar man tinka?
          </Link>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          <StatCard top={c.durationLabel} bottom="Online kursas" />
          <StatCard top={c.hoursLabel} bottom="Online bootcamp" emphasis />
          <StatCard top="0" bottom="Reikalingų programavimo žinių" />
        </div>

        <div className="mt-6">
          <Countdown
            target={c.startDate}
            label="Iki pirmos sesijos"
            variant="light"
          />
        </div>
      </div>
    </section>
  );
}

function StatCard({
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

/* ───────────────────── 3. Launch Date ───────────────────── */

function LaunchDateSection() {
  return (
    <section className="bg-muted/40 px-4 py-14 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <h2
          className="text-balance text-3xl font-medium leading-[1.1] tracking-tight sm:text-[40px]"
          style={serifStyle}
        >
          Pirma laida startuoja{" "}
          <HighlightedItalic>{c.startDateHuman}</HighlightedItalic>
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          2 sekmadienio vakarai. Online. Kartu su Nojum ir Simu susikursi savo
          AI asistentą, kuris dirbs didžiąją dalį tavo darbų.
        </p>
        <div className="mt-6">
          <CTABand
            href="#kaina"
            label="Užimti vietą bootcamp 01"
            subtitle={`30 dienų pinigų grąžinimo garantija · ${c.pricing.standard.price} €`}
          />
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── 4. Audience Fit ───────────────────── */

function AudienceFitSection() {
  return (
    <section id="ar-tinka" className="px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <h2
          className="text-balance text-3xl font-medium leading-[1.1] tracking-tight sm:text-[40px]"
          style={serifStyle}
        >
          Ar man <HighlightedItalic>tinka</HighlightedItalic> šis kursas?
        </h2>

        <div className="mt-8 space-y-8">
          <FitColumn
            label="Tau, jeigu:"
            tone="positive"
            items={[
              "esi vadovas arba verslo savininkas. Vadovauji komandai, žmonai ar savo smulkiam verslui; kasdien matai, kaip valandos pabėga rutinos darbuose, kurie turėtų užtrukti penkias minutes;",
              "esi specialistas. Dirbi buhalteriu, projektų vadovu, konsultantu, pardavimų vadybininku, rinkodaros, HR ar administracijos srityje; tavo dienas užvaldo pasikartojantis darbas, kuris suvalgo geriausias smegenų valandas;",
              "esi freelanceris. Klientai jau klausia „o tu dirbi su AI?“, ir laikas turėti rimtą atsakymą.",
            ]}
          />
          <FitColumn
            label="Ne tau, jeigu:"
            tone="negative"
            items={[
              "esi programuotojas — tau pačiam viskas seniai aišku, o šis kursas pradedantiesiems.",
              "tikiesi pasyvių pajamų — tai kursas, ne stebuklas. Sistema sutaupys laiko, bet ją susikurti reikia tau.",
              "neturi 4 valandų per mėnesį — čia 2 sekmadieniai po 2 valandas plius nedidelė praktika tarp sesijų.",
            ]}
          />
        </div>

        <div className="mt-10">
          <CTABand
            href="#kaina"
            label="Užimti vietą bootcamp 01"
            subtitle={`30 dienų pinigų grąžinimo garantija · ${c.pricing.standard.price} €`}
          />
        </div>
      </div>
    </section>
  );
}

function FitColumn({
  label,
  tone,
  items,
}: {
  label: string;
  tone: "positive" | "negative";
  items: string[];
}) {
  return (
    <div>
      <p
        className={cn(
          "mb-4 text-[11px] font-semibold uppercase tracking-[0.18em]",
          tone === "positive" ? "text-primary" : "text-muted-foreground",
        )}
      >
        {label}
      </p>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <Card
            key={item}
            className="flex flex-row items-start gap-4 rounded-2xl border-border/60 p-5"
          >
            <span
              className={cn(
                "text-2xl font-medium leading-none",
                tone === "positive"
                  ? "text-primary"
                  : "text-muted-foreground/70",
              )}
              style={serifStyle}
            >
              {(idx + 1).toString().padStart(2, "0")}
            </span>
            <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
              {item}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────── 6. Problems ───────────────────── */

function ProblemsSection() {
  const problems = [
    {
      n: 1,
      title: "Šokinėji nuo prompto prie prompto.",
      body: "Šiandien ChatGPT, ryt Gemini, poryt Claude. Kiekvienoje vietoje pradedi nuo nulio. Paaiškini, kas tu, ką dirbi, ko tau reikia. Ir vėl. Ir vėl. Niekur neturi vienos vietos, kur tas kontekstas gyventų. Rezultatas — vidutiniški atsakymai, kuriuos vis tiek tenka taisyti rankomis.",
    },
    {
      n: 2,
      title: "Copy-paste pragaras.",
      body: "AI parašė atsakymą. Tu kopijuoji į el. paštą. Atveri Excel'į, kopijuoji duomenis atgal. Tada į Word'ą. Tada vėl atgal į AI patikslinti. Po pusvalandžio pamirši, ką iš pradžių norėjai. Šokinėjimas tarp programų suvalgo daugiau laiko nei pats darbas. AI atliko per 10 min., copy-paste atėmė 30.",
    },
    {
      n: 3,
      title: "Vienas AI, vienas darbas.",
      body: "Tu naudoji AI kaip įrankį, ne kaip darbuotoją. Klausi, atsako, baigta. Bet darbe niekada nebūna vieno žingsnio. Užduotys turi etapus: surinkti duomenis, paruošti pasiūlymą, parašyti klientui, suvesti į CRM, suplanuoti follow-up. Ir kiekvieną etapą vis dar darai tu pats. Asistentas, kurio reikia, perima pilną grandinę.",
    },
  ];

  return (
    <section className="px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <h2
          className="text-balance text-3xl font-medium leading-[1.1] tracking-tight sm:text-[40px]"
          style={serifStyle}
        >
          Tu jau bandei AI. Bet <HighlightedItalic>3 dalykai</HighlightedItalic>{" "}
          tave stabdo.
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Atvirai kalbant, beveik visi pradeda taip pat. Įsijungia ChatGPT,
          paklausia kelių klausimų, gauna atsakymus. Po savaitės pamiršta. Štai
          kodėl.
        </p>

        <div className="mt-8 space-y-4">
          {problems.map((p) => (
            <Card key={p.n} className="rounded-2xl border-border/60 p-5 sm:p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                Problema #{p.n}
              </p>
              <h3 className="mt-2 text-lg font-semibold sm:text-xl">
                {p.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {p.body}
              </p>
            </Card>
          ))}
        </div>

        <Card className="mt-6 rounded-2xl border-foreground bg-foreground p-6 text-background">
          <p className="text-sm leading-relaxed sm:text-base">
            <strong className="font-semibold">
              Bootcamp&apos;as nėra apie geresnį promptą.
            </strong>{" "}
            Jis yra apie pastatyti sistemą, kuri pažįsta tave, prijungta prie
            tavo programų ir gali atlikti darbą nuo pradžios iki pabaigos — be
            tavo įsikišimo viduryje.
          </p>
        </Card>
      </div>
    </section>
  );
}

/* ───────────────────── 7. Lifestyle Benefits ───────────────────── */

function LifestyleBenefitsSection() {
  const bullets = [
    "pradėtum sportuoti, kaip seniai sau žadėjai, vietoj eilinio vakaro prie ekrano;",
    "daugiau laiko skirtum šeimai ir draugams, o ne tik tarp dviejų darbinių „Zoom“ skambučių;",
    "atgaivintum pomėgį, kurį atidėjai metų metus, nes „neturėjau laiko“ (gitara, kelionės, kursai, knyga);",
    "nuobodžiausius darbus atiduotum asistentui ir nusimestum tylią slegiančią naštą, kurią neši kasdien.",
  ];

  return (
    <section className="bg-muted/40 px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <h2
          className="text-balance text-3xl font-medium leading-[1.1] tracking-tight sm:text-[40px]"
          style={serifStyle}
        >
          Ką darytum su <HighlightedItalic>15 papildomų</HighlightedItalic>{" "}
          valandų kas savaitę?
        </h2>

        <ul className="mt-6 space-y-3">
          {bullets.map((b) => (
            <li
              key={b}
              className="flex items-start gap-3 text-sm leading-relaxed sm:text-base"
            >
              <Check
                className="mt-1 size-5 shrink-0 text-primary"
                aria-hidden
              />
              <span className="text-foreground/90">{b}</span>
            </li>
          ))}
        </ul>

        <Card className="mt-6 rounded-2xl border-l-4 border-l-primary border-y-border/60 border-r-border/60 bg-primary/5 p-5">
          <p className="text-sm leading-relaxed sm:text-base">
            Laiko niekada negalima nupirkti — kol neatsiranda AI asistentas,
            kuris perima darbo naštą už tave.
          </p>
        </Card>

        <div className="mt-10">
          <h3
            className="text-balance text-2xl font-medium leading-tight sm:text-3xl"
            style={serifStyle}
          >
            15 valandų per savaitę{" "}
            <HighlightedItalic>tau atgal</HighlightedItalic>.
          </h3>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Tu jau žinai, ką su jomis darytum. Dabar liko vienas žingsnis.
          </p>
          <div className="mt-5">
            <CTABand
              href="#kaina"
              label="Užimti vietą bootcamp 01"
              subtitle={`30 dienų pinigų grąžinimo garantija · ${c.pricing.standard.price} €`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── 8. Curriculum Grid ───────────────────── */

function CurriculumGridSection() {
  const weeks = [
    {
      week: "Savaitė 1",
      date: "Bir. 21 d.",
      title: "Pradžia ir paruošimas.",
      body: "AI asistento įdiegimas tavo kompiuteryje, pagrindiniai prisijungimai ir pirmasis testas.",
    },
    {
      week: "Savaitė 2",
      date: "Bir. 28 d.",
      title: "Įgūdžiai.",
      body: "Kas tai yra įgūdis, kaip mokyti asistentą ir kokios paprastos taisyklės.",
    },
  ];

  return (
    <section className="px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <h2
          className="text-balance text-3xl font-medium leading-[1.1] tracking-tight sm:text-[40px]"
          style={serifStyle}
        >
          2 savaitės, <HighlightedItalic>2 pamokos.</HighlightedItalic>
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Kiekvieną savaitę pridedam naują pamoką ant praeitos pagrindo. Prieš
          Bootcamp&apos;ą turi tuščią kompiuterį. Po Bootcamp&apos;o — sistemą,
          kuri dirba už tave.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {weeks.map((w) => (
            <Card
              key={w.week}
              className={cn(
                "rounded-2xl border-border/60 p-5",
              )}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                {w.week} · {w.date}
              </p>
              <h3
                className="mt-2 text-lg font-semibold sm:text-xl"
                style={serifStyle}
              >
                {w.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {w.body}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── 9. Curriculum Detail ───────────────────── */

function CurriculumDetailSection() {
  const sessions = [
    {
      n: "01",
      title: "Pradžia ir paruošimas",
      meta: "Bir. 21 d. · Sekmad. · 19:00–20:00",
      tagline: "Pirma „pasakau ir padaro“ akimirka tavo kompiuteryje.",
      result:
        "Tavo asistentas paleistas, prijungtas prie pagrindinių programų ir atsako lietuviškai.",
      will: [
        "Įdiegiame Claude tavo kompiuteryje su visomis reikalingomis teisėmis",
        "Sukuriame pirmąjį asmeninį kontekstą — kas tu, ką dirbi, kaip rašai",
        "Pajungiame prie el. pašto ir failų — pirmas darbas iš karto",
      ],
      take: [
        "Veikiantis AI asistentas tavo kompiuteryje",
        "Pirmasis prijungtas darbas (el. pašto santrauka arba ataskaita)",
        "Aiškus planas, ką dirbsi tarp sesijų",
      ],
    },
    {
      n: "02",
      title: "Įgūdžiai",
      meta: "Bir. 28 d. · Sekmad. · 19:00–20:00",
      tagline: "Tavo asistentas pradeda turėti tikrą profesiją.",
      result:
        "Asistentas turi 2–3 paruoštus įgūdžius, kuriuos naudoji kasdien.",
      will: [
        "Suprantame, kas yra įgūdis, ir kaip jį suformuluoti",
        "Sukuriame pirmuosius 2–3 įgūdžius tavo darbui",
        "Patikriname, kaip jie veikia su realiais tavo failais",
      ],
      take: [
        "2–3 paruošti įgūdžiai, kurie dirba",
        "Šablonas, kaip kurti naujus įgūdžius savarankiškai",
        "Praktinis homework iki kitos sesijos",
      ],
    },
  ];

  return (
    <section className="bg-muted/40 px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <h2
          className="text-balance text-3xl font-medium leading-[1.1] tracking-tight sm:text-[40px]"
          style={serifStyle}
        >
          Kiekviena sesija <HighlightedItalic>detaliai.</HighlightedItalic>
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Kiekviena trunka 2 valandas, vyksta online, sekmadieniais 19:00. Po
          kiekvienos sesijos išeini ne su žiniomis, o su konkrečiu veikiančiu
          rezultatu.
        </p>

        <Accordion className="mt-6 space-y-3">
          {sessions.map((s) => (
            <AccordionItem
              key={s.n}
              value={s.n}
              className="overflow-hidden rounded-2xl border border-border/60 bg-card"
            >
              <AccordionTrigger className="px-5 py-4 hover:no-underline">
                <div className="flex items-center gap-4 text-left">
                  <span
                    className="text-3xl font-medium text-primary"
                    style={serifStyle}
                  >
                    {s.n}
                  </span>
                  <div>
                    <p className="text-base font-semibold leading-tight sm:text-lg">
                      {s.title}
                    </p>
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      {s.meta}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5">
                <p
                  className="border-l-2 border-primary pl-3 text-sm italic text-foreground/80 sm:text-base"
                  style={serifStyle}
                >
                  {s.tagline}
                </p>
                <Card className="mt-4 rounded-xl border-foreground bg-foreground p-4 text-background">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] opacity-70">
                    Tavo rezultatas po {s.n} sesijos
                  </p>
                  <p className="mt-2 text-sm leading-relaxed">{s.result}</p>
                </Card>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <DetailList label="Ką darysime" items={s.will} />
                  <DetailList label="Ką išeini turėdamas" items={s.take} />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-10">
          <h3
            className="text-balance text-2xl font-medium leading-tight sm:text-3xl"
            style={serifStyle}
          >
            Pasiruošei? <HighlightedItalic>Rezervuok</HighlightedItalic> savo
            vietą.
          </h3>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            2 sesijos su Nojum. Pradžia {c.startDateHuman}. Vietų ribota.
          </p>
          <div className="mt-5">
            <CTABand
              href="#kaina"
              label="Užimti vietą bootcamp 01"
              subtitle={`30 dienų pinigų grąžinimo garantija · ${c.pricing.standard.price} €`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function DetailList({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
        {label}
      </p>
      <ul className="mt-2 space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 text-sm leading-relaxed"
          >
            <Check
              className="mt-0.5 size-4 shrink-0 text-primary"
              aria-hidden
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ───────────────────── 10. Tool Comparison ───────────────────── */

function ToolComparisonSection() {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto grid max-w-md grid-cols-2 gap-3">
          <ComparisonCard label="ChatGPT" sublabel="dviratis" />
          <ComparisonCard label="AI asistentas" sublabel="lėktuvas" emphasis />
        </div>
        <p className="mt-6 text-sm text-muted-foreground sm:text-base">
          ChatGPT ar AI asistentas su Claude? Čia kaip{" "}
          <span className="font-semibold text-foreground" style={serifStyle}>
            dviratis ir lėktuvas
          </span>{" "}
          — abu juda, tik skirtingais greičiais.
        </p>
      </div>
    </section>
  );
}

function ComparisonCard({
  label,
  sublabel,
  emphasis,
}: {
  label: string;
  sublabel: string;
  emphasis?: boolean;
}) {
  return (
    <Card
      className={cn(
        "rounded-2xl border-border/60 p-5 text-center sm:p-6",
        emphasis && "border-primary bg-primary text-primary-foreground",
      )}
    >
      <p
        className={cn(
          "text-xl font-medium",
          emphasis ? "text-primary-foreground" : "text-foreground",
        )}
        style={serifStyle}
      >
        {label}
      </p>
      <p
        className={cn(
          "mt-1 text-[10px] font-semibold uppercase tracking-[0.18em]",
          emphasis ? "text-primary-foreground/80" : "text-muted-foreground",
        )}
      >
        {sublabel}
      </p>
    </Card>
  );
}

/* ───────────────────── 12. Pricing ───────────────────── */

function PricingSection() {
  return (
    <section id="kaina" className="px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <h2
          className="text-balance text-3xl font-medium leading-[1.1] tracking-tight sm:text-[40px]"
          style={serifStyle}
        >
          Du <HighlightedItalic>keliai.</HighlightedItalic> Vienas tikslas.
        </h2>

        <div className="mt-8 space-y-4">
          <PricingCard
            label="01 laida · Standard"
            price={c.pricing.standard.price}
            tagline="Tiems, kurie nori mokytis darant ir kuriems pakanka grupinio dėmesio."
            features={[
              "Tavo paruoštas AI asistentas",
              "2 online sesijos · 4 val.",
              "Visi sesijų įrašai",
              "4 paruoštų komandų rinkiniai",
              "Sertifikatas (PDF)",
            ]}
            bonus={[
              "Bilietas į webinarą „AI turinio kūrimas“",
              "Starter Kit: 25 paruoštos užduotys + promptai",
              "AI Studijos bendruomenė (1 mėnuo)",
            ]}
            ctaHref={`/checkout?tier=${c.pricing.standard.slug}`}
          />
          <PricingCard
            label="01 laida · Premium"
            price={c.pricing.premium.price}
            tagline="Vadovams ir verslo savininkams — 2 val. asmeninė konsultacija įtraukta."
            featured
            features={[
              "Visa Standard programa",
              "6 paruošti įgūdžiai (verta 500+ €)",
              "2 val. asmeninė konsultacija su Nojum (verta 300 €)",
              "Pirmenybinis dėmesys grupėje",
            ]}
            bonus={[
              "Bilietas į webinarą „AI turinio kūrimas“",
              "Starter Kit: 25 paruoštos užduotys + promptai",
              "AI Studijos bendruomenė (3 mėn.)",
            ]}
            ctaHref={`/checkout?tier=${c.pricing.premium.slug}`}
          />
        </div>

        <Card className="mt-6 rounded-2xl border-border/60 p-5 text-center text-xs text-muted-foreground sm:text-sm">
          <p>
            01 laida pradeda {c.startDateHuman}. Antra laida kils iki{" "}
            {c.pricing.premium.price} €.
          </p>
          <p className="mt-1">Vietų ribota · 30 dienų garantija</p>
        </Card>
      </div>
    </section>
  );
}

function PricingCard({
  label,
  price,
  tagline,
  features,
  bonus,
  ctaHref,
  featured,
}: {
  label: string;
  price: number;
  tagline: string;
  features: string[];
  bonus: string[];
  ctaHref: string;
  featured?: boolean;
}) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden rounded-3xl border p-6 sm:p-8",
        featured
          ? "border-primary bg-foreground text-background"
          : "border-border/60 bg-card text-foreground",
      )}
    >
      {featured ? (
        <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
          <Crown className="size-3" aria-hidden /> VIP
        </div>
      ) : null}

      <p
        className={cn(
          "text-[10px] font-semibold uppercase tracking-[0.18em]",
          featured ? "text-primary" : "text-muted-foreground",
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "mt-3 text-5xl font-medium leading-none sm:text-6xl",
          featured ? "text-background" : "text-foreground",
        )}
        style={serifStyle}
      >
        {price} €
      </p>
      <p
        className={cn(
          "mt-1 text-[10px] font-semibold uppercase tracking-[0.18em]",
          featured ? "text-background/70" : "text-muted-foreground",
        )}
      >
        Vienkartinė kaina
      </p>

      <ul className="mt-6 space-y-2">
        {features.map((f) => (
          <li
            key={f}
            className="flex items-start gap-2 text-sm leading-relaxed"
          >
            <Check
              className={cn(
                "mt-0.5 size-4 shrink-0",
                featured ? "text-primary" : "text-primary",
              )}
              aria-hidden
            />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div
        className={cn(
          "mt-6 rounded-2xl p-4 text-sm",
          featured ? "bg-primary/15" : "bg-primary/5",
        )}
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
          + Bonusai šiai laidai
        </p>
        <ul className="mt-2 space-y-1.5">
          {bonus.map((b) => (
            <li
              key={b}
              className="flex items-start gap-2 text-sm leading-relaxed"
            >
              <Check
                className="mt-0.5 size-4 shrink-0 text-primary"
                aria-hidden
              />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      <Link
        href={ctaHref}
        className={buttonVariants({
          size: "lg",
          variant: featured ? "secondary" : "default",
          className:
            "mt-6 h-12 w-full rounded-full text-sm font-semibold uppercase tracking-wider",
        })}
      >
        Prisijunk · {price} €
      </Link>

      <p
        className={cn(
          "mt-4 text-xs leading-relaxed",
          featured ? "text-background/70" : "text-muted-foreground",
        )}
      >
        {tagline}
      </p>
    </Card>
  );
}

/* ───────────────────── 13. Guarantee ───────────────────── */

function GuaranteeSection() {
  return (
    <section className="bg-foreground px-4 py-14 text-background sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full border-2 border-primary text-primary">
          <span className="text-3xl font-medium" style={serifStyle}>
            100%
          </span>
        </div>
        <h2
          className="mt-6 text-balance text-3xl font-medium leading-[1.1] tracking-tight sm:text-[40px]"
          style={serifStyle}
        >
          Atgausi 15 valandų per savaitę. O jei ne —{" "}
          <HighlightedItalic>grąžiname visus pinigus.</HighlightedItalic>
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-background/80 sm:text-base">
          Jei po 2 sesijų nepajauti, kad atgavai bent 15 valandų per savaitę,
          grąžiname visus pinigus — be klausimų ir be smulkaus šrifto.
        </p>
      </div>
    </section>
  );
}

/* ───────────────────── 14. Testimonials ───────────────────── */

function TestimonialsSection() {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <h2
          className="text-balance text-3xl font-medium leading-[1.1] tracking-tight sm:text-[40px]"
          style={serifStyle}
        >
          Mokiniai <HighlightedItalic>sako.</HighlightedItalic>
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          01 laida tik startuoja. Pirmų absolventų atsiliepimus įdėsime, vos tik
          juos gausime — be aktorių, be išgalvotų istorijų.
        </p>

        {/* TODO: kai surinksi pirmų studentų atsiliepimus — pakeisk šitą placeholder'į
            su realių žmonių vardais, foto ir citatomis. */}
        <Card className="mt-6 rounded-2xl border-dashed border-border/60 bg-muted/30 p-8 text-center">
          <p
            className="text-lg leading-snug text-muted-foreground sm:text-xl"
            style={serifStyle}
          >
            Tavo istorija — gali tapti pirmąja.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Prisijunk prie 01 laidos, ir tavo atsiliepimas pirmas atsiras šiame
            puslapyje.
          </p>
        </Card>
      </div>
    </section>
  );
}

/* ───────────────────── 15. FAQ ───────────────────── */

function FAQSection() {
  const faqs = [
    {
      q: "Ar reikia programavimo žinių?",
      a: "Ne. Bootcamp'as skirtas žmonėms be programavimo patirties. Su asistentu kalbėsi paprasta lietuvių kalba — lygiai taip pat, kaip rašai kolegai.",
    },
    {
      q: "Ar veiks ir su Mac, ir su Windows?",
      a: "Taip. Asistentą diegsime ant abiejų. Prieš pirmąją sesiją Vilius padės susikonfigūruoti.",
    },
    {
      q: "Ar reikia papildomai mokėti už AI prenumeratą?",
      a: "Taip — Claude prenumerata (~20 $/mėn.) yra atskiras mokestis pagal Anthropic kainoraštį. Tai liko vienintelis pastovus įrankis, kurį naudosi.",
    },
    {
      q: "Praleidau sesiją. Ką daryti?",
      a: "Visi sesijų įrašai prieinami per 24 val. Žiūrėk savo tempu, klausimus rašyk grupėje.",
    },
    {
      q: "Mano veiklos sritis netipinė. Ar tiks?",
      a: "Tiks. Asistentas pritaikomas bet kuriai sričiai — buhalterijai, NT, IT pardavimui, e-commerce. Trečios savaitės breakout grupėje dirbame su tavo realiu darbu.",
    },
    {
      q: "Ar galiu gauti pinigų grąžinimą?",
      a: "Taip — 30 dienų po pirmos sesijos. Jei nepasiekei 15 val. per savaitę taupymo, grąžiname 100 %.",
    },
    {
      q: "Kuo skiriasi Standard nuo Premium?",
      a: "Premium įtraukia 6 paruoštus profesionalius įgūdžius, 2 val. 1-on-1 konsultaciją su Nojum ir pirmenybinį dėmesį grupėje.",
    },
    {
      q: "Kiek dėmesio gausiu sesijos metu?",
      a: "Sesijos vyksta nedidelėse grupėse iki 20 žmonių. Visi klausimai atsakomi gyvai. Premium dalyviams pirmenybė.",
    },
    {
      q: "Ar gausiu sertifikatą?",
      a: "Taip — PDF sertifikatas atsiunčiamas el. paštu po paskutinės sesijos.",
    },
    {
      q: "Ar po kurso reikia papildomai mokėti?",
      a: "Ne. Sertifikatas, įrašai ir komandų rinkiniai lieka tau visam laikui. Tik Claude prenumerata yra atskira.",
    },
  ];

  return (
    <section className="bg-muted/40 px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <h2
          className="text-balance text-3xl font-medium leading-[1.1] tracking-tight sm:text-[40px]"
          style={serifStyle}
        >
          Dažniausiai užduodami{" "}
          <HighlightedItalic>klausimai.</HighlightedItalic>
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Jei neradai atsakymo čia — užpildyk{" "}
          <Link href="/kontaktai" className="underline underline-offset-2">
            kontaktinę formą
          </Link>
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
      </div>
    </section>
  );
}

/* ───────────────────── 16. Email Capture ───────────────────── */

function EmailCaptureSection() {
  return (
    <section className="bg-foreground px-4 py-14 text-background sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <h2
          className="text-balance text-3xl font-medium leading-[1.1] tracking-tight sm:text-[40px]"
          style={serifStyle}
        >
          Dar nesi tikras?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-background/80 sm:text-base">
          Prisijunk prie nemokamos AI Studijos bendruomenės. Žmonės iš Lietuvos.
          Pamatyk, kaip mes dirbam, prieš nuspręsdamas dėl Bootcamp&apos;o.
        </p>

        <form
          className="mt-6 flex flex-col gap-3 sm:flex-row"
          method="post"
          action="/api/newsletter"
        >
          <label htmlFor="newsletter-email" className="sr-only">
            El. paštas
          </label>
          <div className="relative flex-1">
            <Mail
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-background/60"
              aria-hidden
            />
            <input
              id="newsletter-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="tavo@epastas.lt"
              className="h-12 w-full rounded-full border border-background/20 bg-background/10 pl-11 pr-4 text-sm text-background placeholder:text-background/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <button
            type="submit"
            className={buttonVariants({
              size: "lg",
              className:
                "h-12 rounded-full px-6 text-sm font-semibold uppercase tracking-wider",
            })}
          >
            Atsiųsti kvietimą
            <ArrowRight className="ml-2 size-4" aria-hidden />
          </button>
        </form>
      </div>
    </section>
  );
}

/* ───────────────────── 17. Final CTA ───────────────────── */

function FinalCTASection() {
  return (
    <section className="bg-foreground px-4 py-14 text-background sm:px-6 sm:py-24">
      <div className="mx-auto max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          Paskutinis žingsnis
        </p>
        <h2
          className="mt-3 text-balance text-3xl font-medium leading-[1.05] tracking-tight sm:text-[44px]"
          style={serifStyle}
        >
          Prisijunk prie <HighlightedItalic>01 laidos.</HighlightedItalic>
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-background/80 sm:text-base">
          {c.startDateFull}. Pradedam kartu kurti tavo AI asistentą. Paprastai,
          žmogiškai, iš bet kurio Lietuvos kampelio. Per 2 sekmadienius gauni 15
          valandų per savaitę atgal į savo gyvenimą.
        </p>

        <div className="mt-6">
          <Countdown target={c.startDate} label="Iki starto" variant="dark" />
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <Link
            href={`/checkout?tier=${c.pricing.standard.slug}`}
            className={buttonVariants({
              size: "lg",
              className:
                "h-12 w-full rounded-full text-sm font-semibold uppercase tracking-wider",
            })}
          >
            Prisijunk · {c.pricing.standard.price} €
          </Link>
          <Link
            href={`/checkout?tier=${c.pricing.premium.slug}`}
            className={buttonVariants({
              size: "lg",
              variant: "outline",
              className:
                "h-12 w-full rounded-full border-background/40 bg-transparent text-sm font-semibold uppercase tracking-wider text-background hover:bg-background/10 hover:text-background",
            })}
          >
            Premium · {c.pricing.premium.price} €
          </Link>
        </div>

        {/* TODO: jei norėsi misijos + skaitiklio sekcijos — užpildyk savo tikrais
            duomenimis (kiek lietuvių iki kada nori išmokyti, tikras pirkėjų skaičius). */}
      </div>
    </section>
  );
}

/* Visual fallback hint for unused icon import — keeps lint clean if removed later */
const _icons = { X };
void _icons;
