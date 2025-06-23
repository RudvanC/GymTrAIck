/**
 * Supabase Browser Client
 *
 * This file exports a function that creates a Supabase client
 * intended to be used only on the client-side (in the browser).
 *
 * It uses the public anonymous key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`),
 * which is safe to expose in frontend environments.
 *
 * ⚠️ Do NOT use this client in server-side code or API routes.
 */


import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
