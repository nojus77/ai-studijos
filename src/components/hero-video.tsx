"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, VolumeX } from "lucide-react";

import { cn } from "@/lib/utils";

interface HeroVideoProps {
  src?: string;
  poster?: string;
  className?: string;
}

const SPEED_OPTIONS = [1, 1.25, 1.5] as const;
type Speed = (typeof SPEED_OPTIONS)[number];

/**
 * Hero promo video — autoplays muted on load, tap-to-unmute rewinds and
 * starts from 0 with sound. After unmute the only controls are pause
 * (bottom-left) and a small speed toggle (bottom-right). No mute or
 * fullscreen — the visitor's choice is "keep watching or pause", not a
 * full media player. If src is missing, renders a tasteful placeholder.
 */
export function HeroVideo({ src, poster, className }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState<Speed>(1);

  // Keep the <video> element's playbackRate in sync with the speed state.
  // Setting it imperatively (not as a JSX attribute) because React doesn't
  // expose playbackRate as a prop, and a state change here must always win
  // over the browser's default of 1×.
  useEffect(() => {
    const el = videoRef.current;
    if (el) el.playbackRate = speed;
  }, [speed]);

  // Sync progress from video timeupdate.
  //
  // The bar uses a sqrt curve instead of linear actual-time. Classic SaaS
  // VSL trick: viewers see the bar race forward in the first few seconds
  // ("I'm already a third in, might as well finish"), then watch it slow
  // down toward the end — which keeps them committed past the usual
  // drop-off point. At real 10% the bar shows 32%, at real 50% it shows
  // 71%, and at real 100% it still hits exactly 100% (Math.pow(1, x)===1)
  // so the visual still completes honestly.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const onTime = (): void => {
      if (el.duration > 0) {
        const actual = el.currentTime / el.duration;
        const perceived = Math.pow(actual, 0.5);
        setProgress(perceived * 100);
      }
    };
    const onPlay = (): void => setPaused(false);
    const onPause = (): void => setPaused(true);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
    };
  }, []);

  const handleFirstTap = (): void => {
    const el = videoRef.current;
    if (el) {
      // Rewind to the start: the muted autoplay has been running since the
      // page loaded, so by the time the user taps for sound they've already
      // missed the opening hook. Restart from 0 so they hear it from the
      // first word.
      el.currentTime = 0;
      el.muted = false;
      void el.play().catch(() => {});
    }
    setShowOverlay(false);
    setProgress(0);
  };

  const togglePlay = (e: React.MouseEvent): void => {
    e.stopPropagation();
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) void el.play().catch(() => {});
    else el.pause();
  };

  const cycleSpeed = (e: React.MouseEvent): void => {
    e.stopPropagation();
    const idx = SPEED_OPTIONS.indexOf(speed);
    const next = SPEED_OPTIONS[(idx + 1) % SPEED_OPTIONS.length];
    setSpeed(next);
  };

  // Display "1×" / "1.25×" / "1.5×" — no trailing zeros on whole speeds.
  const speedLabel = `${speed}×`;

  return (
    <div
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl border border-foreground/10 bg-foreground",
        className,
      )}
    >
      {src ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onClick={showOverlay ? handleFirstTap : togglePlay}
          className="block aspect-video w-full cursor-pointer object-cover"
        />
      ) : (
        <div
          className="block aspect-video w-full bg-gradient-to-br from-foreground via-foreground to-foreground/80"
          aria-hidden
        />
      )}

      {/* First-tap overlay shown until user unmutes */}
      {showOverlay ? (
        <button
          type="button"
          onClick={handleFirstTap}
          aria-label="Įjungti garsą"
          className="absolute inset-0 flex flex-col items-center justify-center bg-background/15 backdrop-blur-[2px]"
        >
          <div className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
            <VolumeX className="size-6" aria-hidden />
          </div>
          <p className="mt-3 text-sm font-semibold text-background drop-shadow">
            Video groja
          </p>
          <p className="text-xs text-background/85 drop-shadow">
            Paspausk, kad girdėtum garsą
          </p>
        </button>
      ) : null}

      {/* Persistent controls after first interaction */}
      {!showOverlay && src ? (
        <>
          {/* Bottom-left: pause only */}
          <button
            type="button"
            onClick={togglePlay}
            aria-label={paused ? "Paleisti" : "Pauzė"}
            className="absolute bottom-3 left-3 flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md transition hover:bg-primary/90"
          >
            {paused ? (
              <Play className="ml-0.5 size-4 fill-current" aria-hidden />
            ) : (
              <Pause className="size-4 fill-current" aria-hidden />
            )}
          </button>

          {/* Bottom-right: small speed toggle — kept compact so it doesn't
              compete with the video for attention. */}
          <button
            type="button"
            onClick={cycleSpeed}
            aria-label={`Greitis ${speedLabel}, paspausk pakeisti`}
            className="absolute bottom-3 right-3 flex h-7 min-w-9 items-center justify-center rounded-md bg-background/80 px-2 text-[11px] font-semibold tabular-nums text-foreground shadow-sm backdrop-blur-sm transition hover:bg-background"
          >
            {speedLabel}
          </button>

          {/* Progress bar at the very bottom edge */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-background/20">
            <div
              className="h-full bg-primary transition-[width] duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        </>
      ) : null}
    </div>
  );
}
