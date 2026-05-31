"use client";

import { createElement, useEffect, useRef, useState } from "react";
import { Gauge } from "lucide-react";

import { cn } from "@/lib/utils";

// Minimal shape of the Wistia <wistia-player> element we touch.
interface WistiaPlayerElement extends HTMLElement {
  muted: boolean;
  volume: number;
  playbackRate: number;
}

// Playback speeds the corner toggle cycles through.
const SPEEDS = [1, 1.25, 1.5];

interface HeroWistiaProps {
  /** Wistia media hashed id, e.g. "wu5uhpxc6u". */
  mediaId: string;
  className?: string;
}

// Site brand yellow (globals.css --primary). Used for the Wistia play
// button + control accents so the player matches the rest of the page.
const PLAYER_COLOR = "#fedf6f";

/**
 * Hero VSL backed by Wistia's web-component player. We load Wistia's two
 * scripts on the client (player.js defines the <wistia-player> element, the
 * per-media module ships the video data) and render the element themed in the
 * brand yellow. The wrapper keeps the same rounded/bordered frame the previous
 * HTML5 player used so the hero looks unchanged apart from the new player.
 */
export function HeroWistia({ mediaId, className }: HeroWistiaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [speed, setSpeed] = useState(1);

  // Cycle the playback speed (1× → 1.5× → 2× → 1×) and push it to the player.
  const cycleSpeed = (): void => {
    const next = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length];
    setSpeed(next);
    const player =
      containerRef.current?.querySelector<WistiaPlayerElement>("wistia-player");
    if (player) {
      try {
        player.playbackRate = next;
      } catch {
        // player not upgraded yet; state still updates and applies on retry
      }
    }
  };

  useEffect(() => {
    const ensureScript = (src: string, isModule: boolean): void => {
      if (document.querySelector(`script[src="${src}"]`)) return;
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      if (isModule) script.type = "module";
      document.body.appendChild(script);
    };
    ensureScript("https://fast.wistia.com/player.js", false);
    ensureScript(`https://fast.wistia.com/embed/${mediaId}.js`, true);
  }, [mediaId]);

  // The video autoplays muted (browsers forbid autoplay with sound). Unmute it
  // on the visitor's first interaction anywhere on the page — a real user
  // gesture is what browsers require to allow audio, so this is the earliest
  // moment sound can legitimately start.
  useEffect(() => {
    let done = false;
    const events = ["pointerdown", "touchstart", "keydown"] as const;

    const unmute = (): void => {
      if (done) return;
      const player = containerRef.current?.querySelector<WistiaPlayerElement>(
        "wistia-player",
      );
      if (!player) return; // not upgraded yet — wait for the next gesture
      done = true;
      player.muted = false;
      try {
        player.volume = 1;
      } catch {
        // older player builds may not expose volume; muted=false is enough
      }
      cleanup();
    };

    const cleanup = (): void => {
      for (const e of events) window.removeEventListener(e, unmute);
    };

    for (const e of events) {
      window.addEventListener(e, unmute, { passive: true });
    }
    return cleanup;
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl border border-foreground/10 bg-foreground",
        className,
      )}
    >
      {/* Blurred swatch placeholder shown until the custom element upgrades. */}
      <style>{`wistia-player[media-id='${mediaId}']:not(:defined){background:center / contain no-repeat url('https://fast.wistia.com/embed/medias/${mediaId}/swatch');display:block;filter:blur(5px);padding-top:56.25%;}`}</style>
      {/* createElement avoids needing a global JSX declaration for the
          non-standard <wistia-player> custom element. */}
      {createElement("wistia-player", {
        "media-id": mediaId,
        aspect: "1.7777777777777777",
        "player-color": PLAYER_COLOR,
        // Autoplay on landing. Browsers block autoplay with sound, so we start
        // muted (silentAutoPlay) and unmute on first interaction (see effect).
        autoplay: true,
        muted: true,
        "silent-autoplay": "allow",
        className: "block w-full",
      })}

      {/* Visible speed toggle so viewers can speed up the video in one tap,
          instead of digging through Wistia's settings menu. */}
      <button
        type="button"
        onClick={cycleSpeed}
        aria-label={`Vaizdo greitis: ${speed}×. Paspausk, kad pakeistum.`}
        className="absolute right-3 top-3 z-10 flex h-8 items-center gap-1 rounded-full bg-background/85 px-3 text-xs font-semibold tabular-nums text-foreground shadow-md backdrop-blur-sm transition hover:bg-background"
      >
        <Gauge className="size-3.5" aria-hidden />
        {speed}×
      </button>
    </div>
  );
}
