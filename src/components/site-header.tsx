import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <div className="px-4 pt-4 sm:pt-6">
      <header
        className="mx-auto grid w-full max-w-[860px] items-center gap-2 rounded-2xl border-2 border-foreground bg-background px-4 py-3 sm:grid-cols-[1fr_2fr_1fr] sm:gap-4 sm:px-6 sm:py-4"
        style={{ gridTemplateColumns: "1fr 2fr 1fr" }}
      >
        <nav className="hidden items-center gap-5 text-[13px] font-semibold text-foreground sm:flex">
          <Link href="/bootcamp" className="hover:opacity-70">
            Bootcamp
          </Link>
          <Link href="/verslui" className="hover:opacity-70">
            Verslui
          </Link>
        </nav>

        <Link
          href="/"
          className="logo text-center text-xl font-bold tracking-tight text-foreground sm:text-2xl"
          style={{ fontFamily: "var(--font-logo)" }}
        >
          AI STUDIJOS
        </Link>

        <div className="flex items-center justify-end">
          <Link
            href="/checkout?tier=kursas"
            className={buttonVariants({
              size: "sm",
              className:
                "cta-glow rounded-xl bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90",
            })}
          >
            Gauti gidą
          </Link>
        </div>
      </header>
    </div>
  );
}
