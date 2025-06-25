/**
 * @file api/routines/route.ts
 * @description
 * API route to fetch all base routines from the Supabase database.
 * It joins the `base_routines`, `base_routine_exercises`, and `exercises` tables,
 * transforms the data into a flat structure, and returns it as JSON.
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/supabaseClient";
/**
 * Represents a routine with all associated exercise details.
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
 * Represents a single exercise block associated with a routine,
 * including repetition/sets/sorting metadata.
 */
type BaseRoutineExerciseFromDB = {
  sort_order: number;
  sets: number;
  reps: number;
  exercises: {
    id: number;
    name: string;
    gif_url: string;
    equipment: string;
    target: string;
    secondary_muscles: string;
  }[]; // Supabase returns this as an array, even if it usually contains a single item
};

/**
 * Represents the full shape of a base routine record as returned by Supabase.
 */
type BaseRoutineFromDB = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  base_routine_exercises: BaseRoutineExerciseFromDB[];
};

const supabase = createClient();

/**
 * GET handler for retrieving all routines.
 *
 * @returns A JSON response containing an array of routines, or an error message if the fetch fails.
 */
export async function GET() {
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
    .order("slug");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const routines = (data as BaseRoutineFromDB[]).map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    description: r.description,
    exercises: r.base_routine_exercises
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((it) => ({
        ...it.exercises[0], // Flatten exercise object (assuming array with one item)
        sets: it.sets,
        reps: it.reps,
        sort_order: it.sort_order,
      })),
  }));

  return NextResponse.json(routines);
}
