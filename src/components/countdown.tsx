"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface CountdownProps {
  target: string | Date;
  label?: string;
  variant?: "light" | "dark";
  className?: string;
}

interface Parts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const compute = (target: Date): Parts => {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1_000) % 60),
  };
};

const pad = (n: number): string => n.toString().padStart(2, "0");

export function Countdown({
  target,
  label = "Iki pirmos sesijos",
  variant = "light",
  className,
}: CountdownProps) {
  const targetDate = typeof target === "string" ? new Date(target) : target;
  const [parts, setParts] = useState<Parts>(() => compute(targetDate));

  useEffect(() => {
    setParts(compute(targetDate));
    const id = setInterval(() => setParts(compute(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const items: { value: number; label: string }[] = [
    { value: parts.days, label: "dienų" },
    { value: parts.hours, label: "val." },
    { value: parts.minutes, label: "min." },
    { value: parts.seconds, label: "sek." },
  ];

  return (
    <div
      className={cn(
        "w-full rounded-2xl p-4 sm:p-5",
        variant === "light"
          ? "bg-primary/10 text-foreground"
          : "bg-foreground text-background",
        className,
      )}
    >
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] opacity-80">
        {label}:
      </p>
      <div className="grid grid-cols-4 gap-2">
        {items.map((item) => (
          <div
            key={item.label}
            className={cn(
              "rounded-xl px-2 py-3 text-center",
              variant === "light"
                ? "bg-foreground text-background"
                : "bg-background/10 text-background",
            )}
          >
            <p className="text-2xl font-bold tabular-nums sm:text-3xl">
              {pad(item.value)}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-wider opacity-75">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
