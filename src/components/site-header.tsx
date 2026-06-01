import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <div className="px-4 pt-4 sm:pt-6">
      <header className="mx-auto flex w-full max-w-[860px] items-center justify-between gap-3 rounded-2xl border-2 border-foreground bg-background px-4 py-3 sm:px-6 sm:py-4">
        {/* Left: logo mark + wordmark */}
        <Link
          href="/"
          className="flex items-center gap-2 whitespace-nowrap text-lg font-bold tracking-tight text-foreground sm:text-xl"
          style={{ fontFamily: "var(--font-logo)" }}
        >
          <Image
            src="/logo-mark.png"
            alt=""
            width={768}
            height={768}
            priority
            className="size-7 shrink-0 sm:size-8"
          />
          AI STUDIJOS
        </Link>

        {/* Center nav (desktop only) */}
        <nav className="hidden items-center gap-6 text-[13px] font-semibold text-foreground sm:flex">
          <Link href="/dirbtuves" className="hover:opacity-70">
            Dirbtuvės
          </Link>
          {/* Verslui tab hidden for now
          <Link href="/verslui" className="hover:opacity-70">
            Verslui
          </Link>
          */}
        </nav>

        {/* Right: CTA */}
        <Link
          href="/checkout?tier=kursas"
          className={buttonVariants({
            size: "sm",
            className:
              "cta-glow whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90",
          })}
        >
          Gauti gidą
        </Link>
      </header>
    </div>
  );
}
