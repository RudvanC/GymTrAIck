// src/lib/supabaseClient.ts
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types"; // si tienes tipos

/**
 * Esta es la única instancia de Supabase en el cliente.
 * Usada tanto por el provider como por useSupabaseClient().
 */
export const supabaseClient: SupabaseClient<Database> =
  createPagesBrowserClient();
