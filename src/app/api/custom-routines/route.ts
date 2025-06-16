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
