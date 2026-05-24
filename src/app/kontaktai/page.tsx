import type { Metadata } from "next";
import { ArrowRight, Clock, MessageSquare } from "lucide-react";

import { HighlightedItalic } from "@/components/highlighted-italic";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const metadata: Metadata = {
  title: "Kontaktai · AI Studijos",
  description:
    "Susisiek su AI Studijos komanda per formą — atsakome per 24 val. darbo dienomis.",
};

const serifStyle = { fontFamily: "var(--font-serif)" } as const;

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <ContactInfoSection />
        <ContactFormSection />
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
          Kontaktai
        </p>
        <h1
          className="mt-3 text-balance text-[36px] font-medium leading-[1.05] tracking-tight sm:text-[48px]"
          style={serifStyle}
        >
          <HighlightedItalic>Susisiek</HighlightedItalic> su mumis.
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
          Klausimai apie Bootcamp&apos;ą, B2B mokymus, bendradarbiavimą — rašyk
          ir atsakysime asmeniškai.
        </p>
      </div>
    </section>
  );
}

function ContactInfoSection() {
  return (
    <section className="px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto grid max-w-2xl gap-4 sm:grid-cols-2">
        <Card className="rounded-2xl border-border/60 p-6">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <MessageSquare className="size-5" aria-hidden />
          </div>
          <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Kontaktinė forma
          </p>
          <p
            className="mt-1 text-lg font-semibold leading-tight"
            style={serifStyle}
          >
            Žemiau šiame puslapyje
          </p>
        </Card>

        <Card className="rounded-2xl border-border/60 p-6">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Clock className="size-5" aria-hidden />
          </div>
          <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Atsakymo laikas
          </p>
          <p
            className="mt-1 text-lg font-semibold leading-tight"
            style={serifStyle}
          >
            Per 24 val. d.d.
          </p>
        </Card>
      </div>
    </section>
  );
}

function ContactFormSection() {
  return (
    <section className="bg-muted/40 px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <h2
          className="text-balance text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl"
          style={serifStyle}
        >
          Arba parašyk <HighlightedItalic>per formą</HighlightedItalic>.
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Užpildyk laukus žemiau ir atsakysime per 24 val. darbo dienomis.
        </p>

        <form
          method="post"
          action="/api/leads"
          className="mt-8 space-y-4 rounded-3xl border border-border/60 bg-card p-6 sm:p-8"
        >
          <input type="hidden" name="source" value="kontaktai" />

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
            <Label htmlFor="email">El. paštas *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="tavo@epastas.lt"
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
              placeholder="UAB Pavyzdys (neprivaloma)"
              className="h-11 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="situacija">Žinutė</Label>
            <Textarea
              id="situacija"
              name="situacija"
              rows={5}
              placeholder="Apie ką nori pakalbėti? Kuo galime padėti?"
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
            Siųsti žinutę
            <ArrowRight className="ml-2 size-4" aria-hidden />
          </button>

          <p className="text-center text-xs text-muted-foreground">
            Atsakome asmeniškai per 24 val. darbo dienomis. Be spamo.
          </p>
        </form>
      </div>
    </section>
  );
}
