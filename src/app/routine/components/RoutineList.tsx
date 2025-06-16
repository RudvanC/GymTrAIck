"use client";

import useSWR from "swr";
import { useState } from "react";
import type { Routine } from "@/app/api/recommend-routines-by-answer/route";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import RoutineRunner from "@/app/routine/components/RoutineRunner";
import RegenerateButton from "@/app/routine/components/RegenerateButton";
import { DeleteRoutineButton } from "@/app/routine/components/DeleteRoutineButton";

/* Utilidad genérica para fetch + manejo de errores */
const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  });

/* Props: el UUID de la fila en user_answers
   Pásalo como null/undefined mientras aún no lo tengas */
interface RoutineListProps {
  answerId: string | null;
}

export default function RoutineList({ answerId }: RoutineListProps) {
  /* Llama al endpoint solo cuando answerId ya existe */
  const { data, error } = useSWR<Routine[]>(
    answerId ? `/api/recommend-routines-by-answer?answer_id=${answerId}` : null,
    fetcher
  );

  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);

  /* Estado de error / carga */
  if (error) return <p className="text-red-500">Error cargando rutinas</p>;
  if (!data) return <LoadingSpinner />;

  /* Vista runner si ya eligieron una rutina */
  if (selectedRoutine) {
    return (
      <RoutineRunner
        routine={selectedRoutine}
        onBack={() => setSelectedRoutine(null)}
      />
    );
  }

  function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /* Vista listado de rutinas */
  return (
    <>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {data.map((routine) => (
          <section
            key={routine.id}
            className="bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg transition"
          >
            <div className="flex w-full justify-between">
              <h2 className="flex text-xl font-bold text-white items-center">
                {routine.name}
              </h2>{" "}
              <span className="justify-end">
                <DeleteRoutineButton
                  answerId={answerId!}
                  routineId={routine.id}
                />
              </span>
            </div>
            {routine.description && (
              <p className="text-sm text-gray-400 mb-4">
                {routine.description}
              </p>
            )}

            <div className="flex justify-between items-end mt-auto">
              <div>
                <p className="text-sm text-gray-300">
                  🏋️ Ejercicios:{" "}
                  <span className="font-medium text-white">
                    {routine.exercises.length}
                  </span>
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  💪 Músculos:{" "}
                  {Array.from(
                    new Set(
                      routine.exercises.map((e: any) =>
                        capitalizeFirstLetter(e.target)
                      )
                    )
                  ).join(", ")}
                </p>
              </div>

              <button
                onClick={() => setSelectedRoutine(routine)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition"
              >
                Empezar rutina
              </button>
            </div>
          </section>
        ))}
      </div>
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mt-8 shadow-sm">
        <h3 className="text-lg font-semibold text-white mb-2">
          ¿No te gusta esta rutina?
        </h3>
        <p className="text-sm text-gray-400 mb-1">
          Puedes regenerarla si no se ajusta a tus necesidades.
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Esta acción reemplazará la rutina actual. Asegúrate de querer hacerlo.
        </p>
        <RegenerateButton />
      </div>
    </>
  );
}
