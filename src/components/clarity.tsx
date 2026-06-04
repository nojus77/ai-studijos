// Microsoft Clarity project ID.
const CLARITY_ID = "x1jkffzh1v";

// Clarity's official, static loader snippet (not user input). Rendered as a
// raw inline <script> in the server HTML — see below.
const SNIPPET = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`;

/**
 * Microsoft Clarity tracking tag — session replays + heatmaps.
 *
 * Rendered as a real inline <script> in the server-rendered HTML (root layout)
 * so it executes on first paint, exactly as Clarity's "paste into <head>"
 * install expects. The previous next/script `afterInteractive` approach only
 * injected the tag client-side after hydration (it showed up in the RSC flight
 * payload, not as a real <script>), which Clarity was not detecting. The
 * snippet is a fixed, trusted constant — no user input flows into it.
 */
export function Clarity() {
  return (
    <script id="ms-clarity" dangerouslySetInnerHTML={{ __html: SNIPPET }} />
  );
}
