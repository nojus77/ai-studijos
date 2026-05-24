import { cn } from "@/lib/utils";

interface HighlightedItalicProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Headline accent word — hand-drawn marker pen ellipse around the word.
 * Mirrors the aievoliucija "savo" pattern: word keeps parent text color,
 * yellow primary ellipse circles it with slight asymmetry + tilt so it
 * reads hand-drawn rather than perfect SVG.
 *
 * Component name kept for back-compat across existing pages.
 */
export function HighlightedItalic({
  children,
  className,
}: HighlightedItalicProps) {
  return (
    <span
      className={cn(
        "relative inline-block whitespace-nowrap font-bold",
        className,
      )}
    >
      <svg
        aria-hidden
        viewBox="0 0 200 60"
        preserveAspectRatio="none"
        className="pointer-events-none absolute left-[-0.45em] top-[-0.18em] -z-10 h-[calc(100%+0.36em)] w-[calc(100%+0.9em)] -rotate-[1.5deg] text-red-600"
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
      {children}
    </span>
  );
}
