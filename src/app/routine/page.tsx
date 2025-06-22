/**
 * RoutinePage
 *
 * This is the main protected page where users can:
 * - View generated recommended routines
 * - Add routines manually or create custom ones
 * - Regenerate their plan if unsatisfied
 *
 * Requirements:
 * - Must be authenticated (uses `useAuth` context)
 * - Must have completed the questionnaire (answerId available)
 */

"use client";

import RoutineList from "@/app/routine/components/RoutineList";
import AddRoutineDialog from "@/app/routine/components/AddRoutineDialog";
import AddCustomRoutineDialog from "@/app/routine/components/AddCustomRoutineDialog";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import useSWR, { mutate } from "swr";
import { useAuth } from "@/context/AuthContext";
import CustomRoutineList from "@/app/routine/components/CustomRoutineList";
import RegenerateButton from "@/app/routine/components/RegenerateButton";

const fetcher = (url: string) =>
  fetch(url).then(async (res) => {
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  });

function RoutinePage() {
  const { user } = useAuth();

  // Fetch the latest answer from the user to get their profile ID
  const {
    data: answers,
    error: ansError,
    isLoading: answersLoading,
  } = useSWR(user ? `/api/user-answers?user_id=${user.id}` : null, fetcher);

  const answerId: string | null =
    answers && answers.length > 0 ? answers[0].id : null;

  if (!user || answersLoading) {
    return <LoadingSpinner />;
  }

  if (ansError) {
    return (
      <div className="p-4 md:p-8 text-red-600 max-w-xl mx-auto">
        Error cargando perfil: {ansError.message}
      </div>
    );
  }

  if (!answerId) {
    return (
      <div className="p-4 md:p-8 text-gray-600 max-w-xl mx-auto">
        No se encontraron rutinas para tu perfil. Por favor completa el
        cuestionario primero.
      </div>
    );
  }

  return (
    // ===== 1. CONTENEDOR PRINCIPAL RESPONSIVE =====
    <div className="max-w-7xl mx-auto p-4 md:p-8 text-slate-50 gap-6 md:gap-8 flex flex-col">
      {/* - p-4: Menos padding en móviles.
        - md:p-8: El padding original para pantallas medianas y más grandes.
        - gap-6 md:gap-8: Menos espaciado entre secciones en móvil.
      */}

      {/* ===== 2. BOTONES DE ACCIÓN RESPONSIVE ===== */}
      <div className="flex flex-col sm:flex-row sm:justify-end gap-4">
        {/* - flex-col: Los botones se apilan verticalmente en móviles.
          - sm:flex-row: Vuelven a estar en fila en pantallas pequeñas y más grandes.
          - sm:justify-end: Se alinean a la derecha a partir de ese tamaño.
        */}
        <AddCustomRoutineDialog />
        <AddRoutineDialog
          answerId={answerId}
          onAdded={() =>
            mutate(`/api/recommend-routines-by-answer?answer_id=${answerId}`)
          }
        />
      </div>

      {/* AI-generated routines */}
      <RoutineList answerId={answerId} />

      {/* User-created custom routines */}
      <CustomRoutineList answerId={answerId} />

      {/* ===== 3. CAJA DE REGENERAR RESPONSIVE ===== */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 sm:p-6 mt-8 shadow-sm text-slate-50">
        {/* - p-4: Menos padding en móviles.
          - sm:p-6: El padding original para pantallas pequeñas y más grandes.
        */}
        <h3 className="text-lg font-semibold text-white mb-2">
          ¿No te satisface el plan?
        </h3>
        <p className="text-sm text-gray-400 mb-1">
          Puedes regenerarlas si no cumplen con tus objetivos.
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Esta acción reemplazará todas las rutinas actuales. Procede con
          precaución.
        </p>

        <RegenerateButton answerId={answerId} />
      </div>
    </div>
  );
}
export default RoutinePage;
