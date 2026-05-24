"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize2, Pause, Play, Volume2, VolumeX } from "lucide-react";

import { cn } from "@/lib/utils";

interface HeroVideoProps {
  src?: string;
  poster?: string;
  className?: string;
}

/**
 * Hero promo video — autoplays muted on load, tap-to-unmute reveals audio
 * + persistent controls (pause, mute, fullscreen) + progress bar at bottom.
 * If src is missing, renders a tasteful placeholder (no broken state).
 */
export function HeroVideo({ src, poster, className }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [progress, setProgress] = useState(0);

  // Sync progress from video timeupdate
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const onTime = (): void => {
      if (el.duration > 0) setProgress((el.currentTime / el.duration) * 100);
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
      el.muted = false;
      void el.play().catch(() => {});
    }
    setMuted(false);
    setShowOverlay(false);
  };

  const togglePlay = (e: React.MouseEvent): void => {
    e.stopPropagation();
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) void el.play().catch(() => {});
    else el.pause();
  };

  const toggleMute = (e: React.MouseEvent): void => {
    e.stopPropagation();
    const el = videoRef.current;
    if (!el) return;
    const next = !muted;
    el.muted = next;
    setMuted(next);
  };

  const toggleFullscreen = (e: React.MouseEvent): void => {
    e.stopPropagation();
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void el.requestFullscreen().catch(() => {});
  };

  return (
    <div
      ref={containerRef}
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
          {/* Bottom-left: pause + mute */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={paused ? "Paleisti" : "Pauzė"}
              className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md transition hover:bg-primary/90"
            >
              {paused ? (
                <Play className="ml-0.5 size-4 fill-current" aria-hidden />
              ) : (
                <Pause className="size-4 fill-current" aria-hidden />
              )}
            </button>
            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? "Įjungti garsą" : "Išjungti garsą"}
              className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md transition hover:bg-primary/90"
            >
              {muted ? (
                <VolumeX className="size-4" aria-hidden />
              ) : (
                <Volume2 className="size-4" aria-hidden />
              )}
            </button>
          </div>

          {/* Bottom-right: fullscreen */}
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label="Visas ekranas"
            className="absolute bottom-3 right-3 flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md transition hover:bg-primary/90"
          >
            <Maximize2 className="size-4" aria-hidden />
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
