import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CTABandProps {
  href?: string;
  label?: string;
  subtitle?: string;
  className?: string;
}

export function CTABand({
  href = "/bootcamp#kaina",
  label = "Užimti vietą bootcamp 01",
  subtitle = "30 dienų pinigų grąžinimo garantija · 147 €",
  className,
}: CTABandProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <Link
        href={href}
        className={buttonVariants({
          size: "lg",
          className:
            "h-14 w-full justify-between rounded-2xl text-sm font-semibold uppercase tracking-wider sm:text-base",
        })}
      >
        <span>{label}</span>
        <ArrowRight className="size-5" aria-hidden />
      </Link>
      {subtitle ? (
        <p className="text-center text-xs text-muted-foreground sm:text-sm">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
