"use client";

import useSWR from "swr";
import { useState } from "react";
import type { Routine } from "@/app/api/base-routines/route";
import LoadingSpinner from "../common/LoadingSpinner";
import RoutineRunner from "@/components/routine/RoutineRunner";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  });

export function RoutineList() {
  const { data, error, isLoading } = useSWR<Routine[]>(
    "/api/base-routines",
    fetcher
  );
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);

  if (error) return <p className="text-red-500">Error cargando rutinas</p>;
  if (!data) return <LoadingSpinner />;

  // Si ya elegí una rutina, muestro el runner
  if (selectedRoutine) {
    return (
      <RoutineRunner
        routine={selectedRoutine}
        onBack={() => setSelectedRoutine(null)}
      />
    );
  }

  // Si no, muestro el listado con botón de “Empezar rutina”
  return (
    <div className="grid gap-8">
      {data.map((routine) => (
        <section key={routine.id} className="p-6 border rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-2">{routine.name}</h2>
          {routine.description && (
            <p className="text-gray-600 mb-4">{routine.description}</p>
          )}

          {/* Card resumen: nombre + target */}
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">
                Ejercicios: {routine.exercises.length}
              </p>
              <p className="text-sm text-gray-500">
                Músculos:{" "}
                {Array.from(
                  new Set(routine.exercises.map((e) => e.target))
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
