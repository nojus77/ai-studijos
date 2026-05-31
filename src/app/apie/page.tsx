import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { HighlightedItalic } from "@/components/highlighted-italic";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Kas mes · AI Studijos",
  description:
    "AI Studijos — dviejų žmonių komanda iš Lietuvos, mokanti praktiškai naudoti dirbtinį intelektą darbe ir versle.",
};

const serifStyle = { fontFamily: "var(--font-serif)" } as const;

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  photo: string;
  align: "right" | "left";
}

const team: TeamMember[] = [
  {
    name: "Nojus",
    role: "AI Automatizacijų Agentūros Įkūrėjas",
    bio: "Kasdien su komanda kuriame AI sprendimus klientams — nuo klientų aptarnavimo asistento iki sudėtingiausių procesų automatizacijos. Apie tokį patį pasirengimą, kurį darome verslo klientams, išmokysiu ir tave.",
    photo: "/nojus-full.png",
    align: "right",
  },
  {
    name: "Simas",
    role: "Marketingo Agentūros JAV Įkūrėjas",
    bio: "AI naudoju kasdien savo versle — turinio kūrimui, klientų valdymui, ataskaitoms. Praktinė patirtis ne iš teorinių kursų, o iš realių klientų projektų.",
    photo: "/simas-full.png",
    align: "left",
  },
];

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <SkoolCoverSection />
        <StorySection />
        <TeamSection />
        <CTASection />
      </main>
      <SiteFooter />
    </>
  );
}

function HeroSection() {
  return (
    <section className="px-4 pb-10 pt-12 sm:px-6 sm:pt-16">
      <div className="mx-auto max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          Apie mus
        </p>
        <h1
          className="mt-3 text-balance text-[36px] font-medium leading-[1.05] tracking-tight sm:text-[48px]"
          style={serifStyle}
        >
          Kas mes — AI Studijos.
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
          Dviejų žmonių komanda iš Lietuvos. Mokome praktiškai naudoti dirbtinį
          intelektą — ne kaip madą ar šūkį, o kaip įrankį, kuris realiai atgauna
          laiką tavo gyvenime.
        </p>
      </div>
    </section>
  );
}

function SkoolCoverSection() {
  return (
    <section className="px-4 pb-4 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
          <Image
            src="/cover.png"
            alt="AI Studijos uždara Skool bendruomenė"
            width={2064}
            height={512}
            className="h-auto w-full"
            priority
          />
        </div>
      </div>
    </section>
  );
}

function StorySection() {
  return (
    <section className="px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-2xl space-y-6 text-[15px] leading-relaxed text-foreground/90 sm:text-base">
        <p>
          AI Studijos prasidėjo nuo paprasto klausimo: kodėl visi kalba apie AI,
          bet nedaug kas iš tikrųjų jį naudoja kasdieniam darbui? Atsakymas
          paprastas — žmonėms reikia ne paskaitos apie technologijas, o
          konkretaus pavyzdžio, kaip pradėti.
        </p>
        <p>
          Todėl ir sugalvojome paleisti Lietuvoje pirmuosius tokius mokymus, po
          kurių labai aiškiai išmoksite praktiškai naudoti AI darbe — be
          techninių terminų, be reikalavimo pirma mokytis Python ar API
          kvietimų. Tiesiai prie kompiuterio, su realiais darbais, lietuviškai.
        </p>
        <p>
          Tikime, kad AI nėra apie tai, kas pakeis tave. AI yra apie tai, kas{" "}
          <HighlightedItalic>perima rutininius darbus</HighlightedItalic> ir
          atgauna tau laiką veikloms, kurios yra svarbesnės — šeimai, draugams,
          pomėgiams arba tiesiog tylesniam vakarui be ekrano.
        </p>
      </div>
    </section>
  );
}

function TeamSection() {
  return (
    <section className="bg-muted/40 px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <h2
          className="text-balance text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl"
          style={serifStyle}
        >
          Du žmonės už visko.
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Maža komanda. Aiškus pasidalijimas. Atsakomybė konkrečiam veidui.
        </p>

        <div className="mt-12 space-y-12 sm:space-y-16">
          {team.map((member) => (
            <Card
              key={member.name}
              className="overflow-visible rounded-2xl border-border/60 px-4 py-5 sm:px-6 sm:py-7"
            >
              {/* Explicit grid columns so the photo and text never share
                  pixels. minmax(0, ...) on the text column lets long words
                  shrink wrap instead of stretching the column wider than
                  intended. Larger gap keeps a comfortable margin between
                  the photo silhouette and the bio. */}
              <div
                className={cn(
                  "grid items-end gap-6 sm:gap-8",
                  member.align === "right"
                    ? "grid-cols-[110px_minmax(0,1fr)] sm:grid-cols-[150px_minmax(0,1fr)]"
                    : "grid-cols-[minmax(0,1fr)_110px] sm:grid-cols-[minmax(0,1fr)_150px]",
                )}
              >
                {/* Photo — fixed-width column with negative top margin so it
                    still reads as floating above the card edge. */}
                <div
                  className={cn(
                    "-mt-16 sm:-mt-20",
                    member.align === "left" && "order-2",
                  )}
                >
                  <Image
                    src={member.photo}
                    alt={member.name}
                    width={698}
                    height={2002}
                    className="h-auto w-full object-contain object-bottom"
                  />
                </div>
                {/* Text column — bottom-aligned, wraps within its own
                    minmax(0, 1fr) cell. Always left-aligned: right-aligning
                    on the mirrored card produced a jagged left edge where
                    every line started in a different position. */}
                <div className="min-w-0 pb-1 sm:pb-2">
                  <p
                    className="text-xl font-medium leading-tight"
                    style={serifStyle}
                  >
                    {member.name}
                  </p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
                    {member.role}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {member.bio}
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

function CTASection() {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl rounded-3xl border border-border/60 bg-card p-8 text-center sm:p-12">
        <h2
          className="text-balance text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl"
          style={serifStyle}
        >
          Pradėk nuo <HighlightedItalic>Bootcamp&apos;o</HighlightedItalic>.
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Per 2 sekmadienio vakarus susikursi savo AI asistentą. 100 % online,
          jokio programavimo.
        </p>
        <Link
          href="/dirbtuves"
          className={buttonVariants({
            size: "lg",
            className:
              "mt-6 h-12 w-full rounded-full text-sm font-semibold uppercase tracking-wider sm:w-auto sm:px-10",
          })}
        >
          Pažiūrėti Bootcamp
        </Link>
      </div>
    </section>
  );
}
