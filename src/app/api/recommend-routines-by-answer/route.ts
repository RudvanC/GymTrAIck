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
  process.env.SERVICE_ROLE_KEY! // ⬅️  service-role para usar el RPC sin RLS
);

export async function GET(req: Request) {
  /** 1️⃣ Toma `answer_id` como query param ?answer_id=... */
  const { searchParams } = new URL(req.url);
  const answerId = searchParams.get("answer_id");
  if (!answerId)
    return NextResponse.json(
      { error: "Missing query param: answer_id" },
      { status: 400 }
    );

  /** 2️⃣ Llama al RPC que ya creaste */
  const { data: recs, error: rpcError } = await supabase.rpc(
    "recommend_routines_by_answer",
    { p_answer_id: answerId }
  );

  if (rpcError)
    return NextResponse.json({ error: rpcError.message }, { status: 500 });

  // Si no hay recomendación, responde lista vacía
  if (!recs || recs.length === 0) return NextResponse.json([]);

  /** 3️⃣ Extrae los IDs recomendados */
  const routineIds = recs.map((r: any) => r.routine_id);

  /** 4️⃣ Trae los detalles con ejercicios sólo para esos IDs */
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
    .in("id", routineIds); // ⬅️  filtro por los recomendados

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  /** 5️⃣ Misma transformación que usabas antes */
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
