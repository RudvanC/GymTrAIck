// app/progress/components/Progress.tsx

"use client";

import { useState } from "react";
import { UserRoutineResult } from "@/types/ProgressType";
import type { Session } from "@supabase/supabase-js";

interface ProgressProps {
  results: UserRoutineResult[];
  session: Session | null;
  error?: string;
}

export default function ProgressList({
  results,
  session,
  error,
}: ProgressProps) {
  const [openCardId, setOpenCardId] = useState<number | null>(null);

  const handleCardClick = (cardId: number) => {
    setOpenCardId(openCardId === cardId ? null : cardId);
  };

  if (!session) {
    return <p>Inicia sesión para ver tu progreso.</p>;
  }

  if (error) {
    return <p>Error al cargar los datos: {error}</p>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-white dark:text-gray-100">
        Historial de Entrenamientos
      </h1>

      {results.length === 0 ? (
        <p className="text-white dark:text-gray-400">
          Aún no has completado ninguna rutina. ¡Completa una para ver tu
          progreso!
        </p>
      ) : (
        <div className="space-y-4">
          {results.map((result) => {
            // Extraemos el tipo de un ejercicio y de una serie
            type ExerciseType = UserRoutineResult["results"][number];
            type SeriesType = ExerciseType["series"][number];

            // 1️⃣ Normalizamos result.results a un array de ExerciseType
            const exercisesData: ExerciseType[] = Array.isArray(result.results)
              ? result.results
              : typeof result.results === "string"
              ? (JSON.parse(result.results) as ExerciseType[])
              : result.results
              ? ([result.results] as ExerciseType[])
              : [];

            const isOpen = openCardId === result.id;

            return (
              <div
                key={result.id}
                className="bg-gray-800 dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleCardClick(result.id)}
              >
                <div className="p-6">
                  {/* Cabecera */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
                        {result.base_routines?.name || "Rutina sin nombre"}
                      </h2>
                      <p className="text-sm text-white dark:text-gray-400 mt-1">
                        Completado el:{" "}
                        {new Date(result.completed_at).toLocaleDateString(
                          "es-ES",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                    <svg
                      className={`w-6 h-6 transform transition-transform duration-300 text-gray-400 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>

                  {/* Contenido desplegable */}
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      isOpen
                        ? "max-h-[1000px] pt-4 mt-4 border-t border-gray-200 dark:border-gray-700"
                        : "max-h-0"
                    }`}
                  >
                    <h3 className="font-semibold text-white dark:text-gray-200 mb-2">
                      Ejercicios Realizados ({exercisesData.length})
                    </h3>
                    <ul className="space-y-2">
                      {exercisesData.map((exercise) => {
                        // 2️⃣ Normalizamos exercise.series a un array de SeriesType
                        const seriesData: SeriesType[] = Array.isArray(
                          exercise.series
                        )
                          ? exercise.series
                          : typeof exercise.series === "string"
                          ? (JSON.parse(exercise.series) as SeriesType[])
                          : exercise.series
                          ? ([exercise.series] as SeriesType[])
                          : [];

                        return (
                          <li
                            key={exercise.exerciseId}
                            className="text-sm text-white dark:text-gray-300 pl-4 border-l-2 border-indigo-200 dark:border-indigo-800"
                          >
                            <span className="font-medium capitalize">
                              {exercise.exerciseName}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">
                              {" "}
                              - {seriesData.length} series
                              <div className="mt-2 pl-4 text-sm text-gray-500 dark:text-gray-400">
                                <p>
                                  <span className="font-medium text-gray-400 dark:text-gray-300">
                                    Repeticiones:
                                  </span>{" "}
                                  {seriesData
                                    .map((s: SeriesType) => s.actualReps)
                                    .join(" - ")}
                                </p>
                                <p>
                                  <span className="font-medium text-gray-400 dark:text-gray-300">
                                    Pesos (kg):
                                  </span>{" "}
                                  {seriesData
                                    .map((s: SeriesType) => s.weight)
                                    .join(" - ")}
                                </p>
                              </div>
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
