/**
 * Server Component: ProgressPage
 *
 * Renders the user's workout progress history by fetching completed routines
 * from Supabase using SSR (Server-Side Rendering) via `createServerClient`.
 *
 * @remarks
 * - Uses `cookies()` from Next.js to enable secure SSR authentication.
 * - Handles session validation and fallback if user is not authenticated.
 * - Returns a `<ProgressList />` component with data or error.
 *
 * @returns A `ProgressList` component showing progress data or fallback messages.
 */

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import ProgressList from "@/app/progress/components/ProgressList";
import { UserRoutineResult } from "@/types/ProgressType";
import DataPerSession from "@/app/progress/components/Charts/DataPerSession";

export default async function ProgressPage() {
  // Access cookie store for SSR auth session management
  const cookieStore = await cookies();

  // Initialize the Supabase server client with custom cookie handling
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Silently fail in server components — handled by middleware
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // Silently fail in server components
          }
        },
      },
    }
  );

  // Get the current authenticated session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If no user is logged in, show empty progress
  if (!session) {
    return <ProgressList results={[]} session={null} />;
  }

  // Fetch completed workout routines for the logged-in user
  const { data, error } = await supabase
    .from("combined_routine_results")
    .select("*")
    .eq("user_id", session.user.id)
    .order("completed_at", { ascending: false });

  // Handle fetch error by logging and rendering fallback UI
  if (error) {
    console.error("Error fetching progress data:", error.message);
    return (
      <ProgressList results={[]} error={error.message} session={session} />
    );
  }

  // Return progress list with fetched data
  return (
    <>
      <DataPerSession />
      <ProgressList
        results={data as unknown as UserRoutineResult[]}
        session={session}
      />
    </>
  );
}
