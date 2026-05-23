import { cn } from "@/lib/utils";

interface HighlightedItalicProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Headline accent word — inline yellow color on dark ink text.
 * Mirrors the learninai "Done-for-you <yellow>AI guides</yellow>" pattern.
 * Despite the legacy name, this is no longer italic — kept name for backwards
 * compatibility across existing pages.
 */
export function HighlightedItalic({
  children,
  className,
}: HighlightedItalicProps) {
  return (
    <span
      className={cn("relative inline-block font-bold text-primary", className)}
    >
      {children}
    </span>
  );
}
