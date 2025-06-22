// Reemplaza TODO tu archivo con este código

import { createClient } from "@/lib/supabase/server";
import { ChartComponent } from "./ChartComponent";
import { MuscleRadarChart } from "./MuscleRadarChart";

export default async function DataPerSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <p className="text-slate-400">
          Debes iniciar sesión para ver tu progreso.
        </p>
      </main>
    );
  }

  // --- 1. OBTENEMOS DATOS PARA EL GRÁFICO DE LÍNEAS ---
  const { data: workoutVolumeData, error: workoutVolumeError } =
    await supabase.rpc("get_user_workout_volume", {
      p_user_id: user.id,
    });

  // --- 2. OBTENEMOS DATOS PARA EL GRÁFICO DE RADAR ---
  const { data: muscleSummaryData, error: muscleSummaryError } =
    await supabase.rpc(
      "get_muscle_group_summary", // <-- ¡LA FUNCIÓN REAL!
      {
        p_user_id: user.id,
        p_days_history: 365, // Usamos un año para asegurar que tenemos datos
      }
    );

  // -- Logs para depurar en la terminal del servidor --
  console.log("Datos de Volumen:", workoutVolumeData);
  console.log("Error de Volumen:", workoutVolumeError);
  console.log("Datos de Músculos:", muscleSummaryData);
  console.log("Error de Músculos:", muscleSummaryError);

  return (
    // Un layout de Grid para organizar los gráficos
    <main className="p-4 md:p-8 space-y-8">
      <h1 className="text-3xl font-bold text-white tracking-tight">
        Tu Progreso
      </h1>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* --- SECCIÓN DEL GRÁFICO DE VOLUMEN --- */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-white">Volumen por Sesión</h2>
          {workoutVolumeData && workoutVolumeData.length > 0 ? (
            <ChartComponent data={workoutVolumeData} />
          ) : (
            <div className="flex items-center justify-center text-center h-96 bg-slate-900/50 rounded-xl border border-slate-800">
              <p className="text-slate-400">
                Completa una rutina para ver tu progreso de volumen.
              </p>
            </div>
          )}
        </div>

        {/* --- SECCIÓN DEL GRÁFICO DE RADAR --- */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-white">
            Balance Muscular (Último Año)
          </h2>
          {muscleSummaryData && muscleSummaryData.length >= 3 ? (
            <MuscleRadarChart data={muscleSummaryData} />
          ) : (
            <div className="flex items-center justify-center text-center h-96 bg-slate-900/50 rounded-xl border border-slate-800">
              <p className="text-slate-400">
                Entrena al menos 3 grupos musculares diferentes para ver tu
                balance.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
