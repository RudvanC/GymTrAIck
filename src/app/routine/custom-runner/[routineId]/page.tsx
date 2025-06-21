import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import CustomRoutineRunner from "@/app/routine/components/CustomRoutineRunner";
import type { CustomRoutine } from "@/app/routine/types/all";

// --- Definimos los tipos de forma explícita fuera ---
type PageProps = {
  params: { routineId: string };
};

const formatRoutineData = (data: any): CustomRoutine | null => {
  if (!data || !data.exercises) return null;
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    slug: data.slug,
    isCustom: true,
    exercises: data.exercises.map((ex: any) => ({
      ...ex.exercises,
      sets: ex.sets,
      reps: ex.reps,
    })),
  };
};

// --- Componente de Página ---
export default async function CustomRoutineRunnerPage({ params }: PageProps) {
  // Capturamos el ID antes de cualquier espera para cumplir con la regla de Next.js
  const routineIdToFetch = params.routineId;

  // Primero creamos el cliente de Supabase (después de leer params)
  const supabase = await createClient();

  // Validate user session
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    // If there is no valid session redirect to login
    redirect("/auth/login");
  }

    const { data: customRoutineData, error } = await supabase
    .from("user_custom_routines")
    .select(
      `
        id, name, description,
        exercises:user_custom_routine_exercises (
          sets, reps,
          exercises (id, name, target, gif_url)
        )
      `
    )
    .eq("id", routineIdToFetch)
    .eq("user_id", user.id)
    .single();

  if (error || !customRoutineData) {
    // Si la rutina personalizada no se encuentra, mostramos 404
    console.error(
      `No se encontró la rutina personalizada con ID ${routineIdToFetch}:`,
      error
    );
    notFound();
  }

  const formattedRoutine = formatRoutineData(customRoutineData);

  if (!formattedRoutine) {
    // Si el formateo falla por datos inesperados
    console.error(
      `Los datos para la rutina ${routineIdToFetch} están corruptos o incompletos.`
    );
    notFound();
  }

  return (
    <div className="w-full h-full">
      <CustomRoutineRunner routine={formattedRoutine} />
    </div>
  );
}
