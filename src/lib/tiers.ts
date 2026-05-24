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
    priceEur: 97,
    shortName: "Bootcamp Standard",
  },
  premium: {
    slug: "premium",
    label: "Bootcamp 01 — Premium",
    priceEur: 347,
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

export type BumpId = "bootcampStandard" | "bootcampPremium" | "aiSpecialists";

export const BUMPS: Record<BumpId, BumpInfo> = {
  bootcampStandard: {
    id: "bootcampStandard",
    label: "AI Studijos Bootcamp",
    description: "2 sesijos online + paruošti workflow'ai + 1 mėn. bendruomenė",
    priceEur: 97,
    popular: true,
    getPriceId: () => env.stripePriceBootcampStandard(),
  },
  bootcampPremium: {
    id: "bootcampPremium",
    label: "AI Studijos Bootcamp + 2 val. konsultacija",
    description:
      "Viskas iš Standard + 2 val. asmeninė konsultacija su komanda + 6 paruošti įgūdžiai",
    priceEur: 347,
    getPriceId: () => env.stripePriceBootcampPremium(),
  },
  aiSpecialists: {
    id: "aiSpecialists",
    label: "5 AI Specialistai",
    description:
      "5 paruošti Claude įgūdžiai: el. paštas, ataskaitos, tyrimai, klientų atsakymai, planavimas — copy-paste ir veikia",
    priceEur: 27,
    getPriceId: () => env.stripePriceAiSpecialists(),
  },
};

export const isBumpId = (value: string | undefined): value is BumpId =>
  value === "bootcampStandard" ||
  value === "bootcampPremium" ||
  value === "aiSpecialists";

export const getBump = (id: BumpId): BumpInfo => BUMPS[id];
