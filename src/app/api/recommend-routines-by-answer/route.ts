/**
 * @file api/recommended-routines/route.ts
 * @description
 * API handler for managing recommended workout routines based on the user's latest answers.
 *
 * GET:
 * - Retrieves recommended routines for the authenticated user.
 * - If no plan exists, it triggers a recommendation RPC and stores the plan.
 *
 * DELETE:
 * - Removes a specific routine from the user's current recommendation plan.
 */

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

/**
 * Structure of a recommended routine returned to the frontend.
 */
export type Routine = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  exercises: {
    id: number;
    name: string;
    gif_url: string;
    equipment: string;
    target: string;
    secondary_muscles: string;
    sets: number;
    reps: number;
    sort_order: number;
  }[];
};

/**
 * Creates a Supabase client instance on the server using the current cookie store.
 *
 * @param cookieStore - The cookies object returned by `next/headers`.
 * @returns A configured Supabase client for server-side usage.
 */
function getSupabaseServer(cookieStore: any) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value ?? null,
        set: (name: string, value: string, options: CookieOptions) =>
          cookieStore.set({ name, value, ...options }),
        remove: (name: string, options: CookieOptions) =>
          cookieStore.set({ name, value: "", ...options }),
      },
    }
  );
}

/**
 * GET /api/recommended-routines
 *
 * Returns a list of recommended routines for the authenticated user.
 * If no recommendation plan exists for the latest questionnaire answers, one is generated and persisted.
 */
export async function GET(req: Request) {
  const cookieStore = cookies();
  const supabase = getSupabaseServer(cookieStore);

  const {
    data: { session },
    error: sessionErr,
  } = await supabase.auth.getSession();

  if (sessionErr || !session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const { data: answers, error: ansErr } = await supabase
    .from("user_answers")
    .select("id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1);

  if (ansErr) {
    return NextResponse.json({ error: ansErr.message }, { status: 500 });
  }
  if (!answers || answers.length === 0) {
    return NextResponse.json([], { status: 200 });
  }

  const answerId = answers[0].id;

  const { data: persisted, error: persistErr } = await supabase
    .from("user_routine_plan")
    .select("routine_id, sort_order")
    .eq("answer_id", answerId)
    .order("sort_order");

  if (persistErr) {
    return NextResponse.json({ error: persistErr.message }, { status: 500 });
  }

  let routineIds: string[];

  if (!persisted || persisted.length === 0) {
    const { data: recs, error: rpcError } = (await supabase.rpc(
      "recommend_routines_by_answer",
      { p_answer_id: answerId }
    )) as { data: { routine_id: string }[] | null; error: any };

    if (rpcError) {
      return NextResponse.json({ error: rpcError.message }, { status: 500 });
    }

    if (!recs || recs.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    const rows = recs.map((r, idx) => ({
      answer_id: answerId,
      routine_id: r.routine_id,
      sort_order: idx,
    }));

    const { error: insertErr } = await supabase
      .from("user_routine_plan")
      .insert(rows);

    if (insertErr) {
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }

    routineIds = rows.map((row) => row.routine_id);
  } else {
    routineIds = persisted.map((p) => p.routine_id);
  }

  const { data, error } = await supabase
    .from("base_routines")
    .select(
      `
      id,
      slug,
      name,
      description,
      base_routine_exercises (
        sort_order,
        sets,
        reps,
        exercises (
          id,
          name,
          gif_url,
          equipment,
          target,
          secondary_muscles
        )
      )
    `
    )
    .in("id", routineIds);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const routines: Routine[] = data!.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    description: r.description,
    exercises: (r.base_routine_exercises as any[])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((it: any) => {
        const ex = Array.isArray(it.exercises) ? it.exercises[0] : it.exercises;
        return {
          id: ex.id,
          name: ex.name,
          gif_url: ex.gif_url,
          equipment: ex.equipment,
          target: ex.target,
          secondary_muscles: ex.secondary_muscles,
          sets: it.sets,
          reps: it.reps,
          sort_order: it.sort_order,
        };
      }),
  }));

  return NextResponse.json(routines);
}

/**
 * DELETE /api/recommended-routines?routine_id=<id>
 *
 * Removes a specific routine from the user's current recommendation plan.
 *
 * @param req - Request object including the `routine_id` query param.
 */
export async function DELETE(req: Request) {
  const cookieStore = cookies();
  const supabase = getSupabaseServer(cookieStore);

  const {
    data: { session },
    error: sessionErr,
  } = await supabase.auth.getSession();

  if (sessionErr || !session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const { data: answers, error: ansErr } = await supabase
    .from("user_answers")
    .select("id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1);

  if (ansErr || !answers || answers.length === 0) {
    return NextResponse.json(
      { error: "No previous answers found" },
      { status: 400 }
    );
  }

  const answerId = answers[0].id;

  const { searchParams } = new URL(req.url);
  const routineId = searchParams.get("routine_id");

  if (!routineId) {
    return NextResponse.json(
      { error: "Missing 'routine_id'" },
      { status: 400 }
    );
  }

  const { error: deleteErr } = await supabase
    .from("user_routine_plan")
    .delete()
    .eq("answer_id", answerId)
    .eq("routine_id", routineId);

  if (deleteErr) {
    return NextResponse.json({ error: deleteErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
