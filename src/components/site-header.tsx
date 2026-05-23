import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-base font-semibold tracking-tight text-foreground"
        >
          <span
            aria-hidden
            className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-primary text-[10px] font-bold text-primary-foreground"
          >
            AI
          </span>
          <span>AI Studijos</span>
        </Link>
        <Link
          href="/bootcamp#kaina"
          className={buttonVariants({
            size: "sm",
            className: "rounded-full px-4 text-xs uppercase tracking-wider",
          })}
        >
          Prisijunk
        </Link>
      </div>
    </header>
  );
}
