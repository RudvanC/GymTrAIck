import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies as nextCookies } from "next/headers";
import { z } from "zod";
import type { Database } from "@/lib/supabase/database.types";

/* ── validación ──────────────────────────────────────────────── */
const ExerciseRow = z.object({
  exercise_id: z.union([z.string().uuid(), z.string().regex(/^\d+$/)]),
  sets: z.number().int().positive(),
  reps: z.number().int().positive(),
  position: z.number().int().positive(),
});

const BodySchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  exercises: z.array(ExerciseRow).min(1),
});

const isValid = (name: string, rows: z.infer<typeof ExerciseRow>[]) =>
  name.trim().length >= 3 &&
  rows.length >= 1 &&
  rows.every((r) => r.exercise_id);
export async function GET() {
  const cookieStore = await nextCookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {}, // GET no escribe cookies
      },
    }
  );

  /* usuario */
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();
  if (authErr || !user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  /* cabecera + detalle */
  const { data, error } = await supabase
    .from("user_custom_routines")
    .select(
      `
        id,
        name,
        description,
        user_custom_routine_exercises (
          exercise_id,
          sets,
          reps,
          position,
          exercises (
            name,
            target
          )
        )
      `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  /* shape para el front */
  const payload = (data ?? []).map((r) => ({
    id: String(r.id), // string para que encaje con Routine
    name: r.name,
    description: r.description,
    isCustom: true,
    exercises: r.user_custom_routine_exercises
      .sort((a, b) => a.position - b.position)
      .map((e) => ({
        id: e.exercise_id,
        name: e.exercises?.name,
        target: e.exercises?.target,
        sets: e.sets,
        reps: e.reps,
      })),
  }));

  return NextResponse.json(payload);
}

/* ── POST /api/custom-routines ───────────────────────────────── */
export async function POST(req: NextRequest) {
  /* 1. Store de cookies de la request */
  const cookieStore = await nextCookies();

  /* 2. Cliente Supabase con wrapper getAll / setAll */
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          /** En un Route Handler SÍ podemos escribir cookies */
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  /* 3. Usuario autenticado */
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  /* 4. Validación del body */
  const body = await req.json();
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { name, description, exercises } = parsed.data;

  /* 5. RPC que inserta cabecera + ejercicios */
  const { data, error } = await supabase.rpc("create_user_custom_routine", {
    p_user_id: user.id,
    p_name: name,
    p_description: description ?? "",
    p_exercises: exercises,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ routineId: data }, { status: 201 });
}

/* ── DELETE /api/custom-routines?routine_id=<id> ─────────────── */
export async function DELETE(req: NextRequest) {
  /* 1.  validar query */
  const { searchParams } = new URL(req.url);
  const routineId = searchParams.get("routine_id");
  if (!routineId)
    return NextResponse.json(
      { error: "Parámetro routine_id faltante" },
      { status: 400 }
    );

  /* 2.  cliente + usuario */
  const cookieStore = await nextCookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {}, // no escribimos cookies en DELETE
      },
    }
  );

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  /* 3.  eliminar (RLS ya garantiza user_id = auth.uid) */
  const { error } = await supabase
    .from("user_custom_routines")
    .delete()
    .eq("id", routineId);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  /* 4.  devolver 204 No Content */
  return new NextResponse(null, { status: 204 });
}
