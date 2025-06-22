import { createClient } from "@/lib/supabase/server";
import { ChartComponent } from "./ChartComponent";

export default async function DataPerSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>Debes iniciar sesión para ver tu progreso.</div>;
  }

  // --- CAMBIO ---
  // Llamamos a la nueva función RPC
  const { data: chartData, error } = await supabase.rpc(
    "get_user_workout_volume",
    {
      p_user_id: user.id,
    }
  );
  // --------------

  if (error || !chartData || chartData.length === 0) {
    if (error) console.error("Error fetching chart data:", error);
    return (
      <main className="p-4 md:p-10 mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold mb-4">Tu Progreso</h1>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h2 className="text-lg font-semibold">
            Evolución del Volumen de Entrenamiento
          </h2>
          <p className="mt-4 text-gray-500">
            Aún no tienes suficientes datos para mostrar el gráfico. ¡Completa
            una rutina para empezar!
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <h1 className="text-2xl font-bold mb-4">Tu Progreso</h1>
      <ChartComponent data={chartData} />
    </main>
  );
}
