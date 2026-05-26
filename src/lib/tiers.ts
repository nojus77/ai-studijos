import { env } from "./env";

export type TierSlug = "kursas" | "standard" | "premium";

export interface TierInfo {
  slug: TierSlug;
  label: string;
  /** Short one-liner shown under the title on the checkout product card. */
  tagline: string;
  priceEur: number;
  shortName: string;
}

const TIERS: Record<TierSlug, TierInfo> = {
  kursas: {
    slug: "kursas",
    label: "AI Asistento gidas",
    tagline:
      "Praktinis kursas, kuris išmokys tave naudotis AI asistentu kasdieniame darbe.",
    priceEur: 47,
    shortName: "Kursas",
  },
  standard: {
    slug: "standard",
    label: "Bootcamp 01 — Standard",
    tagline:
      "2 online webinarai + paruošti AI agentai + uždara Skool bendruomenė.",
    priceEur: 97,
    shortName: "Bootcamp Standard",
  },
  premium: {
    slug: "premium",
    label: "Bootcamp 01 — Premium",
    tagline:
      "Viskas iš Standard + 2 val. asmeninė konsultacija + 6 paruošti AI įgūdžiai.",
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
  details: string[];
  priceEur: number;
  popular?: boolean;
  getPriceId: () => string;
}

export type BumpId = "bootcampStandard" | "bootcampPremium" | "aiSpecialists";

export const BUMPS: Record<BumpId, BumpInfo> = {
  bootcampStandard: {
    id: "bootcampStandard",
    label: "AI Studijos Bootcamp",
    description: "2 online webinarai + uždara bendruomenė",
    details: [
      "2 gyvos online sesijos su Nojum ir Simu",
      "Visi sesijų įrašai — žiūrėk kada nori ir gali",
      "Paruošti AI agentai pritaikyti tavo situacijai",
      "Asmeninė pagalba uždaroje Skool bendruomenėje",
      "Praktinis namų darbas tarp sesijų",
    ],
    priceEur: 97,
    popular: true,
    getPriceId: () => env.stripePriceBootcampStandard(),
  },
  bootcampPremium: {
    id: "bootcampPremium",
    label: "AI Studijos Bootcamp + 2 val. konsultacija",
    description:
      "Viskas iš Standard + 2 val. asmeninė konsultacija + 6 paruošti įgūdžiai",
    details: [
      "Viskas, kas yra Bootcamp Standard pakete",
      "2 val. asmeninė Zoom konsultacija su komanda",
      "6 paruošti AI įgūdžiai (verta 500+ €)",
      "Pirmenybinis dėmesys grupėje — tavo klausimai matomi pirmiausi",
      "3 mėn. Skool bendruomenės access (vietoj 1 mėn.)",
    ],
    priceEur: 347,
    getPriceId: () => env.stripePriceBootcampPremium(),
  },
  aiSpecialists: {
    id: "aiSpecialists",
    label: "5 AI Specialistai",
    description:
      "5 paruošti Claude įgūdžiai — copy-paste ir gali pradėti naudotis savo darbe iškart",
    details: [
      "✉️ El. paštas — atsakymai tavo stiliumi per sekundes",
      "📊 Ataskaitos — automatiškai iš Excel/Google Sheets",
      "💬 Klientų atsakymai — paruošti pasiūlymai pagal tavo verslą",
      "📅 Planavimas — savaitės planas iš tavo balso įrašo",
      "🔍 Tyrimai — autopilotu skaito šimtus šaltinių",
    ],
    priceEur: 27,
    getPriceId: () => env.stripePriceAiSpecialists(),
  },
};

export const isBumpId = (value: string | undefined): value is BumpId =>
  value === "bootcampStandard" ||
  value === "bootcampPremium" ||
  value === "aiSpecialists";

export const getBump = (id: BumpId): BumpInfo => BUMPS[id];
