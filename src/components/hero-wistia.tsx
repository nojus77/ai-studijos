"use client";

import { createElement, useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

// Minimal shape of the Wistia <wistia-player> element we touch.
interface WistiaPlayerElement extends HTMLElement {
  muted: boolean;
  volume: number;
}

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
    </div>
  );
}
