"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Prominent "back" bar shown at the top of /privatumas + /salygos.
 * If the user landed here from checkout (or any other in-app page),
 * router.back() takes them right back without re-loading anything.
 * Falls back to /checkout?tier=kursas on a fresh tab where history is empty.
 */
export function LegalBackBar(): React.ReactElement {
  const router = useRouter();

  const handleBack = (): void => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/checkout?tier=kursas");
    }
  };

  return (
    <div className="sticky top-0 z-30 -mx-4 mb-6 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
      <button
        type="button"
        onClick={handleBack}
        className={cn(
          buttonVariants({
            size: "sm",
            className:
              "h-10 rounded-xl bg-primary px-4 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90",
          }),
        )}
      >
        <ArrowLeft className="mr-2 size-4" aria-hidden />
        Grįžti į užsakymą
      </button>
    </div>
  );
}
