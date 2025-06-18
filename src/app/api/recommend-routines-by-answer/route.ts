// app/api/recommended-routines/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

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

import { type CookieOptions } from "@supabase/ssr";

// Accept anything to avoid type mismatch between Next.js and Supabase helpers
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

export async function GET(req: Request) {
  // 1️⃣ Recupera las cookies de la petición
  const cookieStore = cookies();

  // 2️⃣ Inicializa Supabase SSR
  const supabase = getSupabaseServer(cookieStore);

  // 3️⃣ Obtiene la sesión del usuario
  const {
    data: { session },
    error: sessionErr,
  } = await supabase.auth.getSession();

  if (sessionErr || !session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }
  const userId = session.user.id;

  // 4️⃣ Recupera el último answer_id
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

  // 5️⃣ Comprueba si ya existe un plan persistido
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
    // 6️⃣ Genera nuevas recomendaciones vía RPC
    // Supabase RPC devuelve cualquier tipo; lo tipamos como {routine_id:string}[]
    const { data: recs, error: rpcError } = await supabase.rpc(
      "recommend_routines_by_answer",
      { p_answer_id: answerId }
    ) as { data: { routine_id: string }[] | null; error: any };

    if (rpcError) {
      return NextResponse.json({ error: rpcError.message }, { status: 500 });
    }
    if (!recs || recs.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // 7️⃣ Inserta el plan congelado
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
    // 8️⃣ Usa el plan ya existente
    routineIds = persisted.map((p) => p.routine_id);
  }

  // 9️⃣ Recupera los detalles de las rutinas
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

  // 🔟 Da forma al resultado
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

export async function DELETE(req: Request) {
  // 1️⃣ Recupera cookies
  const cookieStore = cookies();
  const supabase = getSupabaseServer(cookieStore);

  // 2️⃣ Verifica sesión
  const {
    data: { session },
    error: sessionErr,
  } = await supabase.auth.getSession();
  if (sessionErr || !session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }
  const userId = session.user.id;

  // 3️⃣ Obtén el último answer_id
  const { data: answers, error: ansErr } = await supabase
    .from("user_answers")
    .select("id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1);

  if (ansErr || !answers || answers.length === 0) {
    return NextResponse.json(
      { error: "No hay respuestas previas" },
      { status: 400 }
    );
  }
  const answerId = answers[0].id;

  // 4️⃣ Lee el routine_id del query param
  const { searchParams } = new URL(req.url);
  const routineId = searchParams.get("routine_id");
  if (!routineId) {
    return NextResponse.json({ error: "Falta routine_id" }, { status: 400 });
  }

  // 5️⃣ Elimina la rutina del plan
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
