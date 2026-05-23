import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  tone?: "light" | "dark" | "soft";
  id?: string;
}

export function Section({
  children,
  className,
  tone = "light",
  id,
}: SectionProps) {
  const toneClass =
    tone === "dark"
      ? "bg-foreground text-background"
      : tone === "soft"
        ? "bg-muted/40 text-foreground"
        : "bg-background text-foreground";
  return (
    <section
      id={id}
      className={cn(toneClass, "px-4 py-14 sm:px-6 sm:py-20", className)}
    >
      <div className="mx-auto w-full max-w-3xl">{children}</div>
    </section>
  );
}

export function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function SectionHeading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "text-balance text-3xl font-medium leading-[1.1] tracking-tight text-foreground sm:text-4xl md:text-[44px]",
        className,
      )}
      style={{ fontFamily: "var(--font-serif)" }}
    >
      {children}
    </h2>
  );
}
