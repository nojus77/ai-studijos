import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Tuoj startuoja
        </p>
        <h1
          className="text-balance text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl md:text-6xl"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          AI Studijos
        </h1>
        <p className="mt-5 max-w-md text-base text-muted-foreground sm:text-lg">
          Praktiniai dirbtinio intelekto mokymai lietuviams. Tuoj atidarome
          pirmą bootcamp laidą.
        </p>
        <div className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:max-w-md sm:flex-row">
          <Link
            href="/bootcamp"
            className={buttonVariants({
              size: "lg",
              className:
                "h-12 w-full rounded-full px-6 text-sm uppercase tracking-wider",
            })}
          >
            Mėnesinis bootcamp · 147 €
          </Link>
          <Link
            href="/kursas"
            className={buttonVariants({
              size: "lg",
              variant: "outline",
              className: "h-12 w-full rounded-full px-6 text-sm",
            })}
          >
            47 € video kursas
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
