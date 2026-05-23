import Stripe from "stripe";

import { env } from "./env";

let cached: Stripe | null = null;

export const stripe = (): Stripe => {
  if (!cached) {
    cached = new Stripe(env.stripeSecretKey(), {
      typescript: true,
    });
  }
  return cached;
};
