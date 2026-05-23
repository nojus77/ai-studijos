import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Naudojimosi sąlygos",
  description:
    "AI Studijos naudojimosi sąlygos: kainos, mokėjimas, pinigų grąžinimas, atsakomybė.",
};

const serifStyle = { fontFamily: "var(--font-serif)" } as const;

export default function SalygosPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 px-4 py-14 sm:px-6 sm:py-20">
        <article className="mx-auto max-w-2xl space-y-8 text-sm leading-relaxed text-foreground/90 sm:text-base">
          <header>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              Teisinė informacija
            </p>
            <h1
              className="mt-3 text-balance text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl md:text-[44px]"
              style={serifStyle}
            >
              Naudojimosi sąlygos
            </h1>
            <p className="mt-3 text-xs text-muted-foreground">
              Atnaujinta: 2026 m. gegužės 24 d.
            </p>
          </header>

          <Section title="1. Paslaugos">
            AI Studijos teikia praktinius dirbtinio intelekto mokymus: video
            kursą („AI Asistento gidas“, 47 €), mėnesinį bootcamp&apos;ą (147 €
            / 397 €) ir mokymus įmonėms (individuali kaina). Visi mokymai vyksta
            lietuvių kalba.
          </Section>

          <Section title="2. Kainos ir mokėjimas">
            Kainos nurodytos su PVM. Mokėjimai apdorojami per Stripe — priimamos
            kreditinės bei debetinės kortelės, Apple Pay ir Google Pay. Pirkimas
            patvirtinamas el. paštu iš karto po sėkmingo mokėjimo.
          </Section>

          <Section title="3. Prieiga prie turinio">
            Įsigijus video kursą gauni prieigą prie video ir PDF medžiagos visam
            gyvenimui. Bootcamp&apos;ą sudaro 4 online sesijos su gyvu vedimu
            plus visi įrašai, kurie lieka tau visam laikui. Įmonių mokymai
            vyksta pagal atskirą susitarimą.
          </Section>

          <Section title="4. 30 dienų pinigų grąžinimo garantija">
            Jei po Bootcamp&apos;o pirmos sesijos nepajauti, kad atgavai bent 15
            valandų per savaitę, per 30 kalendorinių dienų nuo pirkimo gali
            parašyti{" "}
            <a
              className="underline underline-offset-2"
              href="mailto:labas@aistudijos.lt"
            >
              labas@aistudijos.lt
            </a>{" "}
            ir grąžinsime 100 % sumos — be klausimų. 47 € video kursui taikoma
            14 dienų pinigų grąžinimo garantija tomis pačiomis sąlygomis.
          </Section>

          <Section title="5. Intelektinė nuosavybė">
            Visa AI Studijos teikiama medžiaga (video, PDF, prompt&apos;ai,
            šablonai) yra mūsų intelektinė nuosavybė. Gali ją naudoti savo
            asmeniniam darbui ir komandos viduje, bet neturi teisės jos
            perparduoti, viešai dalintis ar mokyti pagal ją kitų be raštiško
            sutikimo.
          </Section>

          <Section title="6. Naudojimosi taisyklės">
            Naudodamasis paslauga įsipareigoji:
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>neperduoti prieigos prie mokymų kitiems asmenims;</li>
              <li>
                nebandyti pažeisti svetainės saugumo ar pasiekti uždarų sričių;
              </li>
              <li>nenaudoti automatizuotų sistemų turiniui rinkti.</li>
            </ul>
          </Section>

          <Section title="7. Atsakomybės ribojimas">
            AI Studijos pateikia mokymų medžiagą tokią, kokia ji yra.
            Negarantuojame konkrečių verslo rezultatų — jie priklauso nuo to,
            kaip pritaikai išmoktas žinias. Mūsų atsakomybė yra ribojama už
            paslaugą sumokėta suma. Negarantuojame trečiųjų šalių įrankių
            (Claude, Stripe, Vercel ir kt.) veikimo.
          </Section>

          <Section title="8. Sąlygų pakeitimai">
            Pasiliekame teisę keisti šias sąlygas — apie esminius pakeitimus
            pranešime el. paštu visiems aktyviems klientams.
          </Section>

          <Section title="9. Taikoma teisė">
            Šios sąlygos taikomos pagal Lietuvos Respublikos teisę. Ginčai
            pirmiausia sprendžiami derybų keliu; nepasiekus susitarimo —
            kompetentinguose Lietuvos teismuose.
          </Section>

          <Section title="10. Kontaktai">
            AI Studijos · el. paštas:{" "}
            <a
              className="underline underline-offset-2"
              href="mailto:labas@aistudijos.lt"
            >
              labas@aistudijos.lt
            </a>
            . Atsakome per 1 darbo dieną.
          </Section>

          <div className="pt-4">
            <Link
              href="/"
              className="text-sm text-primary underline underline-offset-2"
            >
              ← Grįžti į pradžią
            </Link>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold sm:text-2xl" style={serifStyle}>
        {title}
      </h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}
