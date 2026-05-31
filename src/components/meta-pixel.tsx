"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Meta (Facebook) Pixel ID.
const PIXEL_ID = "1655939532349707";

// Module-level (survives React StrictMode's dev double-mount and component
// remounts) so PageView is tracked at most once per unique path. `undefined`
// until the first load, whose PageView is already sent by the inline snippet.
let trackedPath: string | undefined;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

/**
 * Site-wide Meta Pixel. Loads the base pixel and fires a PageView on initial
 * load (inside the inline snippet) plus on every client-side route change.
 *
 * It only ever tracks PageView here — conversion events like Lead are fired
 * separately at the point they actually happen (see PixelLead on the checkout
 * success page), so a PageView never counts as a Lead.
 */
export function MetaPixel() {
  const pathname = usePathname();

  useEffect(() => {
    // First load: record the path but don't track — the inline snippet already
    // fired this PageView. Same-path re-runs (StrictMode) are deduped. Only a
    // genuine navigation to a new path fires another PageView.
    if (trackedPath === undefined) {
      trackedPath = pathname;
      return;
    }
    if (trackedPath === pathname) return;
    trackedPath = pathname;
    window.fbq?.("track", "PageView");
  }, [pathname]);

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_ID}');
fbq('track', 'PageView');`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
