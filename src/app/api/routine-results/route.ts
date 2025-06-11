import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const cookiesStore = await cookies(); // <-- IMPORTANTE!
  const token =
    cookiesStore.get("sb-uyohcowxpzfslhirbdre-auth-token")?.value ?? null;

  const supabase = createRouteHandlerClient({ cookies });

  const body = await req.json();
  const { routineId, results, date } = body;

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { error } = await supabase.from("routine_results").insert({
    user_id: user.id,
    routine_id: routineId,
    date,
    results,
  });

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  return new Response("Success", { status: 200 });
}
