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
  }[]; // 👈 aquí debe ser un array porque es lo que está devolviendo Supabase
};

type BaseRoutineFromDB = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  base_routine_exercises: BaseRoutineExerciseFromDB[];
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SERVICE_ROLE_KEY!
);

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
        ...it.exercises,
        sets: it.sets,
        reps: it.reps,
        sort_order: it.sort_order,
      })),
  }));

  return NextResponse.json(routines);
}
