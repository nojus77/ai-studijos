import Script from "next/script";

// Microsoft Clarity project ID.
const CLARITY_ID = "x1jkffzh1v";

/**
 * Microsoft Clarity — session replays + heatmaps. Loads the Clarity tag after
 * the page is interactive so it never blocks first paint. Clarity tracks SPA
 * route changes on its own, so no per-navigation wiring is needed here.
 */
export function Clarity() {
  return (
    <Script id="ms-clarity" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${CLARITY_ID}");`}
    </Script>
  );
}
