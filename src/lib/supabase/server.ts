// lib/supabase/server.ts
import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  // ¡OJO!  SOLO en el backend:
  process.env.SERVICE_ROLE_KEY!
);
