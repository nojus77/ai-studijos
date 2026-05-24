import { cn } from "@/lib/utils";

interface HighlightedItalicProps {
  children: React.ReactNode;
  className?: string;
  /** When false, renders just the colored word without the marker ellipse. Default true. */
  marker?: boolean;
}

/**
 * Headline accent word — bold yellow text, optionally circled with a
 * hand-drawn red marker pen ellipse (aievoliucija "savo" pattern).
 *
 * Marker uses translucent red so it accents the yellow word without
 * overpowering it; vertical inset is generous so the ellipse sits
 * around the word rather than cutting through letters.
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
      {marker ? (
        <svg
          aria-hidden
          viewBox="0 0 200 60"
          preserveAspectRatio="none"
          style={{ mixBlendMode: "multiply" }}
          className="pointer-events-none absolute left-[-0.55em] top-[-0.45em] -z-10 h-[calc(100%+0.9em)] w-[calc(100%+1.1em)] -rotate-[1.5deg] text-red-600"
        >
          <path
            d="M 14,32 Q 18,7 102,5 Q 188,9 185,30 Q 188,53 100,55 Q 12,51 14,32 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
      {children}
    </span>
  );
}
