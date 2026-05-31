"use client";

import { useEffect, useState } from "react";
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
// Show after either condition fires first.
const SCROLL_THRESHOLD = 0.5; // 50% of page scrolled
const TIME_THRESHOLD_MS = 30_000; // 30 s on page

const serifStyle = { fontFamily: "var(--font-serif)" } as const;

export function SkoolJoinPopup(): React.ReactNode {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Respect a recent dismissal: skip mounting any triggers at all.
    if (isOnCooldown()) return;

    let dismissed = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const trigger = (): void => {
      if (dismissed) return;
      dismissed = true;
      cleanup();
      setOpen(true);
    };

    const onScroll = (): void => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      if (scrollable <= 0) return;
      const ratio = window.scrollY / scrollable;
      if (ratio >= SCROLL_THRESHOLD) trigger();
    };

    const cleanup = (): void => {
      window.removeEventListener("scroll", onScroll);
      if (timeoutId !== null) clearTimeout(timeoutId);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    timeoutId = setTimeout(trigger, TIME_THRESHOLD_MS);

    return cleanup;
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
      <div className="relative w-full max-w-md rounded-2xl border border-border/60 bg-card p-6 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Uždaryti"
          className="absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" aria-hidden />
        </button>

        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          Prisijunk nemokamai
        </p>
        <h2
          id="skool-popup-title"
          className="mt-2 text-balance text-[26px] font-medium leading-[1.1] tracking-tight sm:text-[30px]"
          style={serifStyle}
        >
          AI Studijos bendruomenė
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Gauk prieigą prie augančios{" "}
          <span className="font-semibold text-foreground">80+ AI praktikų</span>{" "}
          bendruomenės: paruoštus workflow&apos;us, AI naujienas, klausimus,
          atsakymus. Klausk, dalinkis, mokykis kasdien.
        </p>
        <ul className="mt-4 space-y-1.5 text-sm text-foreground/85">
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

        <Link
          href={SKOOL_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={dismiss}
          className={cn(
            buttonVariants({ size: "lg" }),
            "mt-6 h-12 w-full rounded-full text-sm font-semibold uppercase tracking-wider",
          )}
        >
          Eiti į bendruomenę
        </Link>
        <button
          type="button"
          onClick={dismiss}
          className="mt-3 block w-full text-center text-[11px] text-muted-foreground transition-colors hover:text-foreground"
        >
          Galbūt vėliau
        </button>
      </div>
    </div>
  );
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
