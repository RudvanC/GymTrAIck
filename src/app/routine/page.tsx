/* app/(protected)/routine/page.tsx */
"use client";

import RoutineList from "@/app/routine/components/RoutineList";
import AddRoutineDialog from "@/app/routine/components/AddRoutineDialog";
import AddCustomRoutineDialog from "@/app/routine/components/AddCustomRoutineDialog";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import useSWR, { mutate } from "swr";
import { useAuth } from "@/context/AuthContext";

const fetcher = (url: string) =>
  fetch(url).then(async (res) => {
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  });

export default function RoutinePage() {
  const { user } = useAuth();

  // Obtenemos el último answer_id del usuario
  const {
    data: answers,
    error: ansError,
    isLoading: answersLoading,
  } = useSWR(
    user ? `/api/user-answers?user_id=${user.id}` : null,
    fetcher
  );

  const answerId: string | null =
    answers && answers.length > 0 ? answers[0].id : null;

  // Mientras no haya sesión o cargue…
  if (!user || answersLoading) {
    return <LoadingSpinner />;
  }

  // Si hubo error…
  if (ansError) {
    return (
      <div className="p-8 text-red-600 max-w-xl mx-auto">
        Error al cargar datos: {ansError.message}
      </div>
    );
  }

  if (!answerId) {
    return (
      <div className="p-8 text-gray-600 max-w-xl mx-auto">
        No se encontraron rutinas para tu perfil. Completa el cuestionario primero.
      </div>
    );
  }



  // Render final
  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex gap-4 justify-end p-4">
        <AddCustomRoutineDialog />
        <AddRoutineDialog
          answerId={answerId!}
          onAdded={() =>
            mutate(`/api/recommend-routines-by-answer?answer_id=${answerId}`)
          }
        />
      </div>
      <RoutineList answerId={answerId} />
    </div>
  );
}
