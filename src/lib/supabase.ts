// This directive indicates that the code in this file is intended to be part of the client-side bundle.
// While the Supabase client can be used server-side, this setup is typical for client-side access.
"use client";

import { createClient } from "@supabase/supabase-js";

// Retrieve Supabase URL and Anonymous Key from environment variables.
// These NEXT_PUBLIC_ variables are exposed to the browser by Next.js.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Runtime check to ensure environment variables are set.
// This provides a clearer error message during development if the .env file is misconfigured.
if (!supabaseUrl) {
  throw new Error(
    "Supabase URL is not defined. Please check your NEXT_PUBLIC_SUPABASE_URL environment variable."
  );
}
if (!supabaseKey) {
  throw new Error(
    "Supabase anonymous key is not defined. Please check your NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable."
  );
}

// Initialize and export the Supabase client instance.
// This instance will be used throughout the application to interact with Supabase services (Auth, Database, etc.).
export const supabase = createClient(supabaseUrl, supabaseKey);
