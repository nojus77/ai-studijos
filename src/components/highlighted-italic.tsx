import { cn } from "@/lib/utils";

interface HighlightedItalicProps {
  children: React.ReactNode;
  className?: string;
  /** When false, renders just the colored word without the marker underline. Default true. */
  marker?: boolean;
}

/**
 * Headline accent word — bold yellow text with a hand-drawn double
 * red marker pen underline. Two slightly-offset curved strokes give
 * the sketchy "scribbled twice" look.
 *
 * Component name kept for back-compat across existing pages.
 */
export function HighlightedItalic({
  children,
  className,
  marker = true,
}: HighlightedItalicProps) {
  return (
    <span
      className={cn(
        "relative inline-block whitespace-nowrap font-bold text-primary",
        className,
      )}
    >
      {children}
      {marker ? (
        <svg
          aria-hidden
          viewBox="0 0 200 30"
          preserveAspectRatio="none"
          className="pointer-events-none absolute bottom-[-0.4em] left-[-0.1em] h-[0.55em] w-[calc(100%+0.2em)] text-red-600"
        >
          {/* Top sweep — long single curve */}
          <path
            d="M 4,10 Q 100,3 196,12"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Bottom scribble — slight wave offset below */}
          <path
            d="M 8,22 Q 60,26 120,21 Q 170,18 192,24"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      ) : null}
    </span>
  );
}
