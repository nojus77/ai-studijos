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

// ───────── Order bumps ─────────

export interface BumpInfo {
  id: BumpId;
  label: string;
  description: string;
  priceEur: number;
  popular?: boolean;
  getPriceId: () => string;
}

export type BumpId = "bootcampStandard" | "bootcampPremium" | "oneOnOne";

export const BUMPS: Record<BumpId, BumpInfo> = {
  bootcampStandard: {
    id: "bootcampStandard",
    label: "AI Bootcamp Standard",
    description: "4 sesijos online + visi paruošti kit'ai + 1 mėn. bendruomenė",
    priceEur: 147,
    getPriceId: () => env.stripePriceBootcampStandard(),
  },
  bootcampPremium: {
    id: "bootcampPremium",
    label: "AI Bootcamp Premium",
    description:
      "2 val. asmeninė konsultacija su mokytoju + 6 paruošti įgūdžiai (verta 500+ €) + 3 mėn. bendruomenė",
    priceEur: 397,
    popular: true,
    getPriceId: () => env.stripePriceBootcampPremium(),
  },
  oneOnOne: {
    id: "oneOnOne",
    label: "1:1 Setup",
    description:
      "2 val. asmeninė Zoom sesija — mokytojas sukonfigūruoja tavo AI asistentą pagal tavo verslą",
    priceEur: 300,
    getPriceId: () => env.stripePriceOneOnOne(),
  },
};

export const isBumpId = (value: string | undefined): value is BumpId =>
  value === "bootcampStandard" ||
  value === "bootcampPremium" ||
  value === "oneOnOne";

export const getBump = (id: BumpId): BumpInfo => BUMPS[id];
