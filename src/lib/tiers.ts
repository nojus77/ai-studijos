import { env } from "./env";

export type TierSlug = "kursas" | "standard" | "premium";

export interface TierInfo {
  slug: TierSlug;
  label: string;
  priceEur: number;
  shortName: string;
}

const TIERS: Record<TierSlug, TierInfo> = {
  kursas: {
    slug: "kursas",
    label: "AI Asistento gidas",
    priceEur: 47,
    shortName: "Kursas",
  },
  standard: {
    slug: "standard",
    label: "Bootcamp 01 — Standard",
    priceEur: 147,
    shortName: "Bootcamp Standard",
  },
  premium: {
    slug: "premium",
    label: "Bootcamp 01 — Premium",
    priceEur: 397,
    shortName: "Bootcamp Premium",
  },
};

export const isTierSlug = (value: string | undefined): value is TierSlug =>
  value === "kursas" || value === "standard" || value === "premium";

export const getTier = (slug: TierSlug): TierInfo => TIERS[slug];

export const getStripePriceId = (slug: TierSlug): string => {
  switch (slug) {
    case "kursas":
      return env.stripePriceKursas();
    case "standard":
      return env.stripePriceBootcampStandard();
    case "premium":
      return env.stripePriceBootcampPremium();
  }
};
