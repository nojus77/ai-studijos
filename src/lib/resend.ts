import { Resend } from "resend";

import { env } from "./env";

let cached: Resend | null = null;

export const resend = (): Resend => {
  if (!cached) cached = new Resend(env.resendApiKey());
  return cached;
};
