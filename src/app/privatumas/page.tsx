import type { Metadata } from "next";
import Link from "next/link";

import { LegalBackBar } from "@/components/legal-back-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Privatumo politika",
  description:
    "AI Studijos privatumo politika. Kokius duomenis renkam, kaip juos naudojam ir kokias turi teises.",
};

const serifStyle = { fontFamily: "var(--font-serif)" } as const;

export default function PrivatumasPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <article className="mx-auto max-w-2xl space-y-8 text-sm leading-relaxed text-foreground/90 sm:text-base">
          <LegalBackBar />
          <header>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              Teisinė informacija
            </p>
            <h1
              className="mt-3 text-balance text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl md:text-[44px]"
              style={serifStyle}
            >
              Privatumo politika
            </h1>
            <p className="mt-3 text-xs text-muted-foreground">
              Atnaujinta: 2026 m. gegužės 24 d.
            </p>
          </header>

          <Section title="1. Kas mes">
            AI Studijos (toliau — „mes“, „AI Studijos“) yra Lietuvoje veikianti
            AI mokymų platforma. Šiame dokumente paaiškiname, kokius asmens
            duomenis renkame, kam juos naudojame, ir kokios yra tavo teisės
            pagal ES Bendrąjį duomenų apsaugos reglamentą (BDAR).
          </Section>

          <Section title="2. Kokius duomenis renkame">
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>
                <strong>Užsakymų duomenys:</strong> el. paštas, mokėjimo
                statusas, pirkimo metaduomenys (užsakymo ID, sumokėta suma,
                pasirinktas paketas). Mokėjimo kortelės duomenys mums niekada
                nepasiekia — juos tvarko Stripe.
              </li>
              <li>
                <strong>Naujienlaiškio prenumerata:</strong> el. paštas ir
                prisijungimo data.
              </li>
              <li>
                <strong>Verslo užklausos:</strong> vardas, įmonė, el. paštas,
                telefonas (neprivaloma), komandos dydis, situacijos aprašymas.
              </li>
              <li>
                <strong>Techniniai duomenys:</strong> IP adresas, naršyklės
                tipas, įrenginio informacija — automatiškai surenkami serverio
                žurnaluose ir analitikoje.
              </li>
            </ul>
          </Section>

          <Section title="3. Kam naudojame duomenis">
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>
                Pristatyti tau įsigytą produktą (video, PDF, bootcamp&apos;o
                prieigą).
              </li>
              <li>Atsakyti į užklausas ir teikti pagalbą.</li>
              <li>
                Siųsti su pirkimu susijusius pranešimus (sąskaitas, priminimus,
                prieigų laiškus).
              </li>
              <li>
                Siųsti naujienlaiškį — tik jei tu davei sutikimą; gali bet kada
                atsisakyti per nuorodą laiško apačioje.
              </li>
              <li>Gerinti svetainę ir produktus (anonimizuota analitika).</li>
            </ul>
          </Section>

          <Section title="4. Su kuo dalinamės duomenimis">
            Niekada neparduodame ir nenuomojame tavo duomenų. Dalinamės jais tik
            su patikimais paslaugų teikėjais, kurie padeda mums veikti:
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>
                <strong>Stripe</strong> (Airija) — mokėjimų apdorojimas.
              </li>
              <li>
                <strong>Supabase</strong> (Vokietija) — duomenų bazės
                talpinimas.
              </li>
              <li>
                <strong>Resend</strong> (JAV, su ES standartinėmis sutarties
                sąlygomis) — el. pašto pristatymas.
              </li>
              <li>
                <strong>Vercel</strong> (JAV, su ES standartinėmis sutarties
                sąlygomis) — svetainės talpinimas.
              </li>
            </ul>
          </Section>

          <Section title="5. Kiek saugome">
            Užsakymų duomenis saugome 10 metų pagal LR buhalterinės apskaitos
            įstatymą. Naujienlaiškio el. paštą — kol neatsisakai prenumeratos.
            Verslo užklausų duomenis — iki 2 metų, jei netampi klientu;
            aktyviems klientams — visą bendradarbiavimo laikotarpį.
          </Section>

          <Section title="6. Tavo teisės">
            Bet kuriuo metu turi teisę:
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>sužinoti, kokius tavo duomenis turime;</li>
              <li>prašyti juos ištaisyti, jei jie neteisingi;</li>
              <li>prašyti juos ištrinti („teisė būti pamirštam“);</li>
              <li>prašyti perkelti duomenis kitam paslaugų teikėjui;</li>
              <li>nesutikti su jų tvarkymu rinkodaros tikslais;</li>
              <li>
                pateikti skundą Valstybinei duomenų apsaugos inspekcijai (
                <a
                  className="underline underline-offset-2"
                  href="https://vdai.lrv.lt"
                >
                  vdai.lrv.lt
                </a>
                ).
              </li>
            </ul>
          </Section>

          <Section title="7. Slapukai">
            Naudojame tik funkcinius slapukus, kurie būtini svetainės veikimui
            (sesija, kalbos pasirinkimas). Trečiųjų šalių analitikos slapukus
            įjungiame tik gavę tavo sutikimą.
          </Section>

          <Section title="8. Kontaktai">
            Visi su privatumu susiję klausimai — pildyk{" "}
            <Link href="/kontaktai" className="underline underline-offset-2">
              kontaktinę formą
            </Link>
            . Atsakome per 5 darbo dienas.
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
