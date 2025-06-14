"use client";

import useSWR from "swr";
import { useState } from "react";
import type { Routine } from "@/app/api/recommend-routines-by-answer/route";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import RoutineRunner from "@/app/routine/components/RoutineRunner";

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

  /* Vista listado de rutinas */
  return (
    <div className="grid gap-8">
      {data.map((routine) => (
        <section key={routine.id} className="p-6 border rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-2">{routine.name}</h2>

          {routine.description && (
            <p className="text-gray-600 mb-4">{routine.description}</p>
          )}

          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">
                Ejercicios: {routine.exercises.length}
              </p>
              <p className="text-sm text-gray-500">
                Músculos:{" "}
                {Array.from(
                  new Set(routine.exercises.map((e: any) => e.target))
                ).join(", ")}
              </p>
            </div>

            <button
              onClick={() => setSelectedRoutine(routine)}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Empezar rutina
            </button>
          </div>
        </section>
      ))}
    </div>
  );
}
