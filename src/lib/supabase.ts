import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { env } from "./env";

export const supabaseBrowser = (): SupabaseClient =>
  createClient(env.supabaseUrl(), env.supabaseAnonKey());

export const supabaseAdmin = (): SupabaseClient =>
  createClient(env.supabaseUrl(), env.supabaseServiceRoleKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
