"use client";

import { useState } from "react";
import { UserRoutineResult } from "@/types/ProgressType";
import type { Session } from "@supabase/supabase-js";
import { ChevronDown } from "lucide-react"; // Usaremos un icono de Lucide para consistencia

/**
 * Props esperadas por el `ProgressList` component.
 */
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
  const [openCardId, setOpenCardId] = useState<string | null>(null);

  /**
   * Maneja el despliegue de los detalles de una tarjeta.
   * @param cardId - ID de la tarjeta a desplegar/ocultar.
   */
  const handleCardClick = (cardId: string) => {
    setOpenCardId(openCardId === cardId ? null : cardId);
  };

  if (!session) {
    return (
      <p className="text-center text-slate-400 mt-10">
        Por favor inicia sesión para ver tu progreso.
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-400 mt-10">
        Error cargando progreso: {error}
      </p>
    );
  }

  return (
    // 1. Contenedor principal con el fondo y estilo de tu app
    <div className="w-full min-h-screen p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-white tracking-tight">
        Historial de Entrenamientos
      </h1>

      {results.length === 0 ? (
        <div className="text-center py-10 bg-slate-900/50 backdrop-blur-lg border border-slate-700/50 rounded-xl">
          <p className="text-slate-300">
            No has completado ninguna rutina todavía.
          </p>
          <p className="text-slate-400 text-sm mt-2">
            ¡Inicia una para ver tu progreso aquí!
          </p>
        </div>
      ) : (
        // 2. Animación de entrada para la lista
        <div className="space-y-4 animate-fade-in-up">
          {results.map((result) => {
            type ExerciseType = UserRoutineResult["results"][number];

            // Normalización de datos (tu lógica es correcta)
            const exercisesData: ExerciseType[] = Array.isArray(result.results)
              ? result.results
              : [];

            const isOpen = openCardId === result.unique_id;

            return (
              // 3. La tarjeta ahora tiene el estilo "glassmorphism"
              <div
                key={result.unique_id}
                className="bg-slate-900/50 backdrop-blur-lg border border-slate-800 rounded-xl shadow-lg transition-all duration-300 hover:border-slate-700 cursor-pointer"
                onClick={() => handleCardClick(result.unique_id)}
              >
                <div className="p-4 md:p-6">
                  {/* Header de la tarjeta */}
                  <div className="flex justify-between items-center">
                    <div>
                      {/* 4. Título de la rutina con el acento cian */}
                      <h2 className="text-xl font-semibold text-cyan-400">
                        {result.routine_name || "Rutina sin nombre"}
                      </h2>
                      <p className="text-sm text-slate-400 mt-1">
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
                    <ChevronDown
                      className={`w-6 h-6 transform transition-transform duration-300 text-slate-500 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {/* 5. Contenido desplegable con transiciones suaves */}
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      isOpen
                        ? "max-h-[1500px] pt-4 mt-4 border-t border-slate-800"
                        : "max-h-0"
                    }`}
                  >
                    <h3 className="font-semibold text-slate-200 mb-3">
                      Ejercicios Realizados ({exercisesData.length})
                    </h3>
                    <ul className="space-y-4">
                      {exercisesData.map((exercise) => (
                        <li
                          key={exercise.exerciseId}
                          // 6. Borde lateral con acento cian para cada ejercicio
                          className="text-sm text-slate-300 pl-4 border-l-2 border-cyan-400/30"
                        >
                          <span className="font-medium capitalize text-slate-100">
                            {exercise.exerciseName}
                          </span>
                          <div className="mt-2 pl-2 text-xs text-slate-400 space-y-1">
                            <p>
                              <span className="font-medium text-slate-300">
                                Repeticiones:
                              </span>{" "}
                              {exercise.series
                                .map((s) => s.actualReps)
                                .join(" | ")}
                            </p>
                            <p>
                              <span className="font-medium text-slate-300">
                                Peso (kg):
                              </span>{" "}
                              {exercise.series.map((s) => s.weight).join(" | ")}
                            </p>
                          </div>
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
