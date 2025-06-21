// src/app/routine-runner/[routineId]/page.tsx (VERSIÓN FINAL CORREGIDA)

import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import RoutineRunner from "@/app/routine/components/RoutineRunner";
import type { Routine } from "@/app/api/recommend-routines-by-answer/route";

export default async function RoutineRunnerPage({
  params,
}: {
  params: { routineId: string };
}) {
  const supabase = await createClient();

  // 1. LA CONSULTA HA SIDO CORREGIDA (sin 'rest')
  const { data: routineData, error } = await supabase
    .from("base_routines")
    .select(
      `
      id,
      name,
      description,
      slug,
      exercises:base_routine_exercises (
        sets,
        reps,
        exercises (
          id,
          name,
          target,
          gif_url
        )
      )
    `
    )
    .eq("id", params.routineId)
    .single();

  // Si hay un error o no se encuentran datos, mostramos un 404
  if (error || !routineData) {
    if (error) {
      // Este log es útil para nosotros en el servidor si algo sigue fallando
      console.error("Error definitivo al buscar la rutina:", error);
    }
    notFound();
  }

  // 2. EL FORMATEO DE DATOS HA SIDO CORREGIDO (sin 'rest')
  const formattedRoutine: Routine = {
    id: routineData.id,
    name: routineData.name,
    description: routineData.description,
    slug: routineData.slug,
    exercises: routineData.exercises.map((ex: any) => ({
      ...ex.exercises,
      sets: ex.sets,
      reps: ex.reps,
      // La línea 'rest: ex.rest' ha sido eliminada
    })),
  };

  return (
    <div className="w-full h-full">
      <RoutineRunner routine={formattedRoutine} />
    </div>
  );
}
