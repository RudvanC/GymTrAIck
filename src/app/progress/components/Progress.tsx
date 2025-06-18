// app/progress/components/Progress.tsx

"use client"; // <-- PASO 1: CONVERTIMOS ESTE COMPONENTE EN CLIENTE

import { useState } from "react"; // <-- Importamos useState
import { UserRoutineResult } from "@/types/ProgressType";
import type { Session } from "@supabase/supabase-js";

interface ProgressProps {
  results: UserRoutineResult[];
  session: Session | null;
  error?: string;
}

export default function Progress({ results, session, error }: ProgressProps) {
  // PASO 2: Creamos un estado para saber qué tarjeta está abierta.
  // Guardamos el 'id' del resultado, o 'null' si ninguna está abierta.
  const [openCardId, setOpenCardId] = useState<number | null>(null);

  // Función para manejar el clic en una tarjeta
  const handleCardClick = (cardId: number) => {
    // Si la tarjeta clicada ya está abierta, la cerramos (poniendo el id a null).
    // Si no, la abrimos (guardando su id).
    setOpenCardId(openCardId === cardId ? null : cardId);
  };

  if (!session) {
    // ... (código de 'no sesión' sin cambios)
    return <p>Inicia sesión para ver tu progreso.</p>;
  }

  if (error) {
    // ... (código de error sin cambios)
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
          {" "}
          {/* Reducimos un poco el espacio entre tarjetas */}
          {results.map((result) => {
            // Determinamos si la tarjeta actual es la que está abierta
            const isOpen = openCardId === result.id;

            return (
              // PASO 3: Toda la tarjeta es ahora un botón clickable
              <div
                key={result.id}
                className="bg-gray-800 dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleCardClick(result.id)}
              >
                <div className="p-6">
                  {/* --- Cabecera de la tarjeta --- */}
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
                    {/* La flecha ahora indica el estado de toda la tarjeta */}
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

                  {/* PASO 4: El contenido desplegable integrado directamente aquí */}
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      isOpen
                        ? "max-h-[1000px] pt-4 mt-4 border-t border-gray-200 dark:border-gray-700"
                        : "max-h-0"
                    }`}
                  >
                    <h3 className="font-semibold text-white dark:text-gray-200 mb-2">
                      Ejercicios Realizados ({result.results.length})
                    </h3>
                    <ul className="space-y-2">
                      {result.results.map((exercise) => (
                        <li
                          key={exercise.exerciseId}
                          className="text-sm text-white dark:text-gray-300 pl-4 border-l-2 border-indigo-200 dark:border-indigo-800"
                        >
                          <span className="font-medium capitalize">
                            {exercise.exerciseName}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">
                            {" "}
                            - {exercise.series.length} series
                            <div className="mt-2 pl-4 text-sm text-gray-500 dark:text-gray-400">
                              <p>
                                <span className="font-medium text-gray-400 dark:text-gray-300">
                                  Repeticiones:
                                </span>{" "}
                                {exercise.series
                                  .map((serie) => serie.actualReps)
                                  .join(" - ")}
                              </p>

                              {/* Opcional: Mostrar los pesos en una línea separada si es necesario */}
                              <p>
                                <span className="font-medium text-gray-400 dark:text-gray-300">
                                  Pesos (kg):     
                                </span>{" "}
                                {exercise.series
                                  .map((serie) => serie.weight)
                                  .join(" - ")}
                              </p>
                            </div>
                          </span>
                        </li>
                      ))}
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
