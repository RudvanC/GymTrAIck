// app/api/recommended-routines/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SERVICE_ROLE_KEY! // service-role → puede insertar
);

export async function GET(req: Request) {
  /* 1 — leer answer_id */
  const { searchParams } = new URL(req.url);
  const answerId = searchParams.get("answer_id");
  if (!answerId)
    return NextResponse.json(
      { error: "Missing query param: answer_id" },
      { status: 400 }
    );

  /* 2 — ¿ya hay plan persistido en user_routine_plan? */
  const { data: persisted, error: persistErr } = await supabase
    .from("user_routine_plan") // ← tu nueva tabla
    .select("routine_id, sort_order")
    .eq("answer_id", answerId)
    .order("sort_order");

  if (persistErr)
    return NextResponse.json({ error: persistErr.message }, { status: 500 });

  let routineIds: string[];

  /* 3 — si NO hay filas → generar, guardar y usar esa lista */
  if (!persisted || persisted.length === 0) {
    const { data: recs, error: rpcError } = await supabase.rpc(
      "recommend_routines_by_answer",
      { p_answer_id: answerId }
    );
    if (rpcError)
      return NextResponse.json({ error: rpcError.message }, { status: 500 });

    if (!recs || recs.length === 0) return NextResponse.json([]);

    /* insertar plan congelado (una vez) */
    const rows = recs.map((r: any, idx: number) => ({
      answer_id: answerId,
      routine_id: r.routine_id,
      sort_order: idx,
    }));

    const { error: insertErr } = await supabase
      .from("user_routine_plan")
      .insert(rows);

    if (insertErr)
      return NextResponse.json({ error: insertErr.message }, { status: 500 });

    routineIds = rows.map((r: any) => r.routine_id);
  } else {
    /* 4 — usar el plan ya guardado */
    routineIds = persisted.map((p) => p.routine_id);
  }

  /* 5 — traer detalles de las rutinas con ejercicios */
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

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  /* 6 — transformar al shape del front */
  const routines: Routine[] = data!.map((r: any) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    description: r.description,
    exercises: r.base_routine_exercises
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((it: any) => ({
        ...it.exercises,
        sets: it.sets,
        reps: it.reps,
        sort_order: it.sort_order,
      })),
  }));

  return NextResponse.json(routines);
}
