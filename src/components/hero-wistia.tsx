"use client";

import { createElement, useEffect } from "react";

import { cn } from "@/lib/utils";

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

  return (
    <div
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
        // muted (silentAutoPlay) — the viewer unmutes from the player controls.
        autoplay: true,
        muted: true,
        "silent-autoplay": "allow",
        className: "block w-full",
      })}
    </div>
  );
}
