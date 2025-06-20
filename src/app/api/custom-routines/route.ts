/**
 * @file api/custom-routines/route.ts
 * @description
 * API handler for managing user-created workout routines.
 * Supports fetching all user routines, creating new routines using an RPC, and deleting routines by ID.
 * Requires authenticated Supabase sessions via cookies.
 */

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies as nextCookies } from "next/headers";
import { z } from "zod";
import type { Database } from "@/lib/supabase/database.types";

/* ── Validation Schema ───────────────────────────────────────── */

/**
 * Represents a single exercise row for a custom routine.
 */
const ExerciseRow = z.object({
  exercise_id: z.union([z.string().uuid(), z.string().regex(/^\d+$/)]),
  sets: z.number().int().positive(),
  reps: z.number().int().positive(),
  position: z.number().int().positive(),
});

/**
 * Schema for the POST body when creating a routine.
 */
const BodySchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  exercises: z.array(ExerciseRow).min(1),
});

/**
 * Basic quick validation function for inputs.
 */
const isValid = (name: string, rows: z.infer<typeof ExerciseRow>[]) =>
  name.trim().length >= 3 &&
  rows.length >= 1 &&
  rows.every((r) => r.exercise_id);

/* ── GET /api/custom-routines ────────────────────────────────── */

/**
 * Retrieves all custom routines created by the authenticated user.
 * Each routine includes its metadata and detailed exercise information.
 */
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
        setAll() {}, // No cookie writing in GET
      },
    }
  );

  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();

  if (authErr || !user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
            target,
            gif_url
          )
        )
      `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const payload = (data ?? []).map((r) => ({
    id: String(r.id),
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
        gif_url: e.exercises?.gif_url,
      })),
  }));

  return NextResponse.json(payload);
}

/* ── POST /api/custom-routines ───────────────────────────────── */

/**
 * Creates a new custom routine for the authenticated user.
 * Expects a JSON body matching `BodySchema`, and uses an RPC to insert the data.
 *
 * @param req - The incoming request with routine data in the body.
 */
export async function POST(req: NextRequest) {
  const cookieStore = await nextCookies();

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // Route handlers allow cookie writing
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = BodySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { name, description, exercises } = parsed.data;

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

/**
 * Deletes a custom routine by its ID, assuming the authenticated user is the owner.
 *
 * @param req - Request object with the `routine_id` query param
 */
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const routineId = searchParams.get("routine_id");

  if (!routineId) {
    return NextResponse.json(
      { error: "Missing 'routine_id' query parameter" },
      { status: 400 }
    );
  }

  const cookieStore = await nextCookies();

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {}, // DELETE should not write cookies
      },
    }
  );

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("user_custom_routines")
    .delete()
    .eq("id", routineId);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return new NextResponse(null, { status: 204 });
}
