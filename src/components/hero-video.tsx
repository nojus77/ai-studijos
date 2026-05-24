"use client";

import { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

import { cn } from "@/lib/utils";

interface HeroVideoProps {
  src?: string;
  poster?: string;
  className?: string;
}

/**
 * Hero promo video — autoplays muted on load, tap-to-unmute reveals audio.
 * Overlay disappears on first tap; video continues playing throughout.
 * If src is missing, renders a tasteful placeholder (no broken state).
 */
export function HeroVideo({ src, poster, className }: HeroVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);

  const handleTap = (): void => {
    const el = ref.current;
    if (!el) {
      setShowOverlay(false);
      return;
    }
    const next = !muted;
    el.muted = next ? true : false;
    if (!next) void el.play().catch(() => {});
    setMuted(next);
    setShowOverlay(false);
  };

  return (
    <button
      type="button"
      onClick={handleTap}
      aria-label={muted ? "Įjungti garsą" : "Išjungti garsą"}
      className={cn(
        "group relative block w-full overflow-hidden rounded-2xl border border-foreground/10 bg-foreground text-left",
        className,
      )}
    >
      {src ? (
        <video
          ref={ref}
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="block aspect-video w-full object-cover"
        />
      ) : (
        // Placeholder until real promo video is added
        <div
          className="block aspect-video w-full bg-gradient-to-br from-foreground via-foreground to-foreground/80"
          aria-hidden
        />
      )}

      {/* Overlay shown until first tap */}
      {showOverlay ? (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-background/15 backdrop-blur-[2px]">
          <div className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
            <VolumeX className="size-6" aria-hidden />
          </div>
          <p className="mt-3 text-sm font-semibold text-background drop-shadow">
            Video groja
          </p>
          <p className="text-xs text-background/85 drop-shadow">
            Paspausk, kad girdėtum garsą
          </p>
        </div>
      ) : null}

      {/* Tiny corner mute indicator once overlay dismissed */}
      {!showOverlay ? (
        <div className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/85 text-foreground">
          {muted ? (
            <VolumeX className="size-4" aria-hidden />
          ) : (
            <Volume2 className="size-4" aria-hidden />
          )}
        </div>
      ) : null}
    </button>
  );
}
