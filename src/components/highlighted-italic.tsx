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
        "relative inline-block whitespace-nowrap font-extrabold tracking-[-0.025em] text-primary",
        className,
      )}
      style={{ textShadow: "0 1px 2px rgba(11, 11, 11, 0.12)" }}
    >
      {children}
      {marker ? (
        <svg
          aria-hidden
          viewBox="0 0 200 16"
          preserveAspectRatio="none"
          className="pointer-events-none absolute bottom-[-0.5em] left-[-0.08em] h-[0.45em] w-[calc(100%+0.16em)] text-red-600"
        >
          {/* Two brush passes very close together — slight asymmetry so
              it reads "drawn twice with marker" rather than parallel lines */}
          <path
            d="M 4,5 Q 100,2 196,7"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M 6,11 Q 100,9 193,11"
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
