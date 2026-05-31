"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SKOOL_URL = "https://www.skool.com/ai-studijos-6327";
const STORAGE_KEY = "skool-popup-dismissed-at";
// How long to wait before showing again after a dismiss (or after the user
// clicked through to Skool — we don't want to nag the same browser session
// every visit).
const COOLDOWN_DAYS = 7;
// Section anchor + how much of it must be past the viewport top before we
// trigger. 0.6 ≈ user has scrolled past the middle-to-bottom of the section.
const TRIGGER_SECTION_ID = "apie-mus";
const TRIGGER_THRESHOLD = 0.6;

const serifStyle = { fontFamily: "var(--font-serif)" } as const;

export function SkoolJoinPopup(): React.ReactNode {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Respect a recent dismissal: skip mounting any triggers at all.
    if (isOnCooldown()) return;

    const target = document.getElementById(TRIGGER_SECTION_ID);
    if (!target) return;

    let fired = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (fired) return;
        // Fire once the user has scrolled enough that 60%+ of the section
        // has crossed above the viewport — i.e. they've read past the
        // mid-/bottom of the "Apie mus" block.
        const ratio = readPastRatio(entry);
        if (ratio >= TRIGGER_THRESHOLD) {
          fired = true;
          setOpen(true);
          observer.disconnect();
        }
      },
      // Sample at many thresholds so we don't miss the band between 0 and 1.
      { threshold: Array.from({ length: 21 }, (_, i) => i / 20) },
    );
    observer.observe(target);

    return () => observer.disconnect();
  }, []);

  // Lock body scroll while modal is open so the dialog doesn't move under
  // taps on mobile.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const dismiss = (): void => {
    markDismissed();
    setOpen(false);
  };

  // Esc closes the modal — basic keyboard parity with a real dialog.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="skool-popup-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="Uždaryti"
        onClick={dismiss}
        className="absolute inset-0 cursor-default bg-background/70 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Uždaryti"
          className="absolute right-3 top-3 z-10 inline-flex size-8 items-center justify-center rounded-full bg-background/80 text-muted-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-background hover:text-foreground"
        >
          <X className="size-4" aria-hidden />
        </button>

        <div className="px-6 pt-6 sm:px-8 sm:pt-8">
          <div className="flex items-center gap-2">
            <Image
              src="/skool-logo.avif"
              alt="Skool"
              width={64}
              height={64}
              className="size-6 shrink-0 rounded-md"
              priority
            />
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              Prisijunk nemokamai
            </p>
          </div>
          <h2
            id="skool-popup-title"
            className="mt-3 text-balance text-[26px] font-medium leading-[1.1] tracking-tight sm:text-[30px]"
            style={serifStyle}
          >
            AI Studijos bendruomenė
          </h2>
          <ul className="mt-5 space-y-1.5 text-sm text-foreground/85">
            <li className="flex gap-2">
              <span
                aria-hidden
                className="mt-2 size-1.5 rounded-full bg-primary"
              />
              <span>Naujausi AI įrankiai ir use case&apos;ai</span>
            </li>
            <li className="flex gap-2">
              <span
                aria-hidden
                className="mt-2 size-1.5 rounded-full bg-primary"
              />
              <span>Konkretūs prompt&apos;ai ir workflow&apos;ai</span>
            </li>
            <li className="flex gap-2">
              <span
                aria-hidden
                className="mt-2 size-1.5 rounded-full bg-primary"
              />
              <span>Klausimai → atsakymai per kelias valandas</span>
            </li>
          </ul>
        </div>

        {/* Community cover image — sits between bullets and CTA so the user
            sees the actual room they're about to enter before clicking. */}
        <div className="mt-6 overflow-hidden bg-muted">
          <Image
            src="/cover.png"
            alt="AI Studijos uždara Skool bendruomenė"
            width={2064}
            height={512}
            className="h-auto w-full"
          />
        </div>

        <div className="p-6 pt-5 sm:p-8 sm:pt-6">
          <Link
            href={SKOOL_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={dismiss}
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-12 w-full rounded-full text-sm font-semibold uppercase tracking-wider",
            )}
          >
            Eiti į bendruomenę
          </Link>
        </div>
      </div>
    </div>
  );
}

/** How far PAST the viewport top the target's bottom edge has scrolled,
 *  expressed as a fraction of the target's own height. 0 = bottom of the
 *  section sits at the top of the viewport (we've scrolled all the way to
 *  the end of the section). 1 = the whole section is below the viewport
 *  top. Negative values mean the section is still partly below the
 *  viewport top. */
function readPastRatio(entry: IntersectionObserverEntry): number {
  const rect = entry.boundingClientRect;
  if (rect.height <= 0) return 0;
  // How much of the section has scrolled ABOVE the viewport top.
  const scrolledAbove = Math.max(0, -rect.top);
  return Math.min(1, scrolledAbove / rect.height);
}

function isOnCooldown(): boolean {
  if (typeof window === "undefined") return true;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;
  const dismissedAt = Number(raw);
  if (Number.isNaN(dismissedAt)) return false;
  const ageMs = Date.now() - dismissedAt;
  return ageMs < COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
}

function markDismissed(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    // Quota / private mode — drop silently.
  }
}
