"use client";

import { useEffect, useRef } from "react";

interface PixelLeadProps {
  /** Order total in major currency units (EUR), e.g. 47. */
  value?: number;
  currency?: string;
}

/**
 * Fires a single Meta Pixel `Lead` conversion event on mount. Rendered only on
 * the checkout success page for a confirmed, paid order — so the Lead is tied
 * to a completed checkout and never to an ordinary PageView.
 */
export function PixelLead({ value, currency = "EUR" }: PixelLeadProps) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    const params =
      typeof value === "number" ? { value, currency } : undefined;
    window.fbq?.("track", "Lead", params);
  }, [value, currency]);

  return null;
}
