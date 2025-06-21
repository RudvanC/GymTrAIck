// lib/supabase/server.ts

/**
 * Supabase Admin Client (Server-Side Only)
 *
 * This file exports a Supabase client instance using the `SERVICE_ROLE_KEY`,
 * intended for secure, server-side operations such as database mutations
 * or user management.
 *
 * ⚠️ WARNING: Never expose the `SERVICE_ROLE_KEY` to the client.
 * This client must only be used in server environments (API routes, server actions, etc).
 */

import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  // ⚠️ ONLY use this key in the backend, never in the client!
  process.env.SERVICE_ROLE_KEY!
);
