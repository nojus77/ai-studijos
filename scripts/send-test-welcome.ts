/**
 * Send a sample welcome email so we can preview what real buyers see.
 *
 *   npx tsx scripts/send-test-welcome.ts <to-email> [tier] [bumps]
 *
 *   # Defaults — kursas with no bumps
 *   npx tsx scripts/send-test-welcome.ts nojus.siugzdinis@gmail.com
 *
 *   # Bootcamp standard
 *   npx tsx scripts/send-test-welcome.ts nojus.siugzdinis@gmail.com standard
 *
 *   # Kursas with the AI Specialists bump
 *   npx tsx scripts/send-test-welcome.ts nojus@example.com kursas aiSpecialists
 *
 *   # Kursas with bootcamp + ai specialists bumps
 *   npx tsx scripts/send-test-welcome.ts nojus@example.com kursas bootcampStandard,aiSpecialists
 *
 * Reads RESEND_API_KEY from .env.local (run `vercel env pull` first if you
 * don't have production secrets locally yet).
 */
import { config } from "dotenv";

config({ path: ".env.local" });

// Type-only imports are erased at compile time, so they don't trigger
// env-checking module code at load — safe to keep at top-level.
import type { BumpId } from "../src/lib/tiers";

async function main(): Promise<void> {
  const [, , toRaw, tierRaw = "kursas", bumpsRaw = ""] = process.argv;

  if (!toRaw) {
    console.error(
      "usage: npx tsx scripts/send-test-welcome.ts <email> [tier] [bumps]",
    );
    process.exit(1);
  }

  if (!process.env.RESEND_API_KEY) {
    console.error(
      "RESEND_API_KEY not found in env. Run `vercel env pull .env.local` first.",
    );
    process.exit(1);
  }

  // Runtime imports done dynamically AFTER dotenv has loaded so env-reading
  // modules (env.ts) see the populated keys.
  const { isTierSlug, isBumpId } = await import("../src/lib/tiers");
  const { sendWelcomeEmail, buildSummary } =
    await import("../src/lib/welcome-email");

  if (!isTierSlug(tierRaw)) {
    console.error(
      `Invalid tier "${tierRaw}". Must be one of: kursas, standard, premium`,
    );
    process.exit(1);
  }

  const bumps: BumpId[] = bumpsRaw
    .split(",")
    .map((s) => s.trim())
    .filter(isBumpId);

  const summary = buildSummary(tierRaw, bumps);

  console.log(`→ Sending sample welcome email to ${toRaw}`);
  console.log(`  Tier: ${tierRaw}`);
  console.log(`  Bumps: ${bumps.length ? bumps.join(", ") : "(none)"}`);

  await sendWelcomeEmail({ email: toRaw, summary });

  console.log(`✅ Sent. Check inbox.`);
}

void main().catch((err) => {
  console.error(err);
  process.exit(1);
});
