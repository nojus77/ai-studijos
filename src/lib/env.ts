const required = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing env var: ${key}`);
  return value;
};

const optional = (key: string): string | undefined =>
  process.env[key] || undefined;

export const env = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  supabaseUrl: () => required("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: () => required("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  supabaseServiceRoleKey: () => required("SUPABASE_SERVICE_ROLE_KEY"),

  stripeSecretKey: () => required("STRIPE_SECRET_KEY"),
  stripePublishableKey: () => required("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"),
  stripeWebhookSecret: () => required("STRIPE_WEBHOOK_SECRET"),
  stripePriceKursas: () => required("STRIPE_PRICE_KURSAS"),
  stripePriceWebinaras: () => optional("STRIPE_PRICE_WEBINARAS"),
  stripePriceBootcampStandard: () => required("STRIPE_PRICE_BOOTCAMP_STANDARD"),
  stripePriceBootcampPremium: () => required("STRIPE_PRICE_BOOTCAMP_PREMIUM"),
  stripePriceOneOnOne: () => required("STRIPE_PRICE_ONE_ON_ONE"),

  resendApiKey: () => required("RESEND_API_KEY"),
  resendFromEmail: () => process.env.RESEND_FROM_EMAIL ?? "labas@aistudijos.lt",

  kursasVideoUrl: () => required("KURSAS_VIDEO_URL"),
  kursasPdfUrl: () => required("KURSAS_PDF_URL"),
  skoolInviteUrl: () => optional("SKOOL_INVITE_URL"),
};
