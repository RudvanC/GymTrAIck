"use client";

import useSWR, { mutate } from "swr";
import { useState } from "react";
import type { Routine } from "@/app/api/recommend-routines-by-answer/route";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import RoutineRunner from "@/app/routine/components/RoutineRunner";
import RegenerateButton from "@/app/routine/components/RegenerateButton";
import { DeleteRoutineButton } from "@/app/routine/components/DeleteRoutineButton";
import CustomRoutineList from "./CustomRoutineList";
import { Button } from "@/components/ui/button";

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

  const [open, setOpen] = useState(false);
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
      <h2 className="text-2xl font-semibold text-white mb-2">
        Rutinas recomendadas
      </h2>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {data.map((routine) => (
          <section
            key={routine.id}
            className="flex flex-col justify-between bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg transition min-h-[260px]"
          >
            {/* Título y botón borrar */}
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl font-bold text-white">{routine.name}</h2>
              <DeleteRoutineButton
                answerId={answerId!}
                routineId={routine.id}
              />
            </div>

            {/* Descripción */}
            {routine.description && (
              <p className="text-sm text-gray-400 mb-4">
                {routine.description}
              </p>
            )}

            {/* Info + botón ejecutar */}
            <div className="mt-auto flex justify-between items-end">
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

              <Button
                onClick={() => setSelectedRoutine(routine)}
                className="border border-gray-700 bg-gray-900 hover:bg-green-600 hover:text-white justify-self-end flex"
              >
                Empezar
              </Button>
            </div>
          </section>
        ))}
      </div>

      {/* Rutinas personalizadas */}
      <div className="mt-8">
        <CustomRoutineList />
      </div>

      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mt-8 shadow-sm">
        <h3 className="text-lg font-semibold text-white mb-2">
          ¿No te gustan estas rutinas?
        </h3>
        <p className="text-sm text-gray-400 mb-1">
          Puedes regenerarlas si no se ajustan a tus necesidades.
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Esta acción reemplazará las rutinas actuales. Asegúrate de querer
          hacerlo.
        </p>

        <RegenerateButton />
      </div>
    </>
  );
}
