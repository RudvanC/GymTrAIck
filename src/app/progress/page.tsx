// app/progress/page.tsx

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import Progress from "./components/Progress";
import { UserRoutineResult } from "@/types/ProgressType";

export default async function ProgressPage() {
  const cookieStore = await cookies();

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
          } catch (error) {
            // Ignorar errores en Server Components (el middleware se encarga)
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // Ignorar errores en Server Components (el middleware se encarga)
          }
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return <Progress results={[]} session={null} />;
  }

  const { data, error } = await supabase
    .from("user_routine_results")
    .select(
      `
      id,
      completed_at,
      results,
      routine_id,
      base_routines (
        name
      )
    `
    )

    .eq("user_id", session.user.id)
    .order("completed_at", { ascending: false });

  console.log("Datos recibidos de Supabase:", JSON.stringify(data, null, 2));

  if (error) {
    console.error("Error fetching progress data:", error.message);
    return <Progress results={[]} error={error.message} session={session} />;
  }

  return (
    <Progress
      results={data as unknown as UserRoutineResult[]}
      session={session}
    />
  );
}
