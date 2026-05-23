import { cn } from "@/lib/utils";

interface HighlightedItalicProps {
  children: React.ReactNode;
  className?: string;
}

export function HighlightedItalic({
  children,
  className,
}: HighlightedItalicProps) {
  return (
    <span
      className={cn("relative inline-block italic", className)}
      style={{ fontFamily: "var(--font-serif)" }}
    >
      <span
        aria-hidden
        className="absolute -inset-x-1 bottom-1 -z-10 h-[0.45em] -skew-y-2 rounded-sm bg-primary/20"
      />
      {children}
    </span>
  );
}
