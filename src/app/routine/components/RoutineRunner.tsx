"use client";

import { useState } from "react";
import type { Routine } from "@/app/api/recommend-routines-by-answer/route";
import { ArrowLeft, Dot } from "lucide-react";

// The types for the component's state and props remain the same
interface SeriesResult {
  completed: boolean;
  actualReps: number;
  weight: number;
}

type ExerciseResultsMap = Record<number, SeriesResult[]>;

interface RoutineRunnerProps {
  routine: Routine;
  onBack: () => void;
}

export function RoutineRunner({ routine, onBack }: RoutineRunnerProps) {
  // State initialization remains the same
  const [results, setResults] = useState<ExerciseResultsMap>(() => {
    const init: ExerciseResultsMap = {};
    routine.exercises.forEach((ex) => {
      init[ex.id] = Array.from({ length: ex.sets }, () => ({
        completed: false,
        actualReps: ex.reps,
        weight: 0,
      }));
    });
    return init;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The function to handle series changes remains the same
  const handleSeriesChange = (
    exerciseId: number,
    seriesIndex: number,
    field: keyof SeriesResult,
    value: boolean | number
  ) => {
    setResults((prev) => {
      const seriesArr = [...prev[exerciseId]];
      seriesArr[seriesIndex] = {
        ...seriesArr[seriesIndex],
        [field]: value,
      };
      return { ...prev, [exerciseId]: seriesArr };
    });
  };

  // --- CAMBIO PRINCIPAL AQUÍ ---
  // The handleSubmit function is updated to transform the data before sending
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      // 1. Transform the 'results' object into a more descriptive array
      const resultsPayload = Object.entries(results).map(
        ([exerciseId, seriesData]) => {
          // Find the corresponding exercise in the routine to get its name
          const exercise = routine.exercises.find(
            (ex) => ex.id === Number(exerciseId)
          );

          return {
            exerciseId: Number(exerciseId),
            // Add the exercise name to the payload
            exerciseName: exercise ? exercise.name : "Ejercicio Desconocido",
            series: seriesData, // Keep the series data
          };
        }
      );

      // 2. Create the final payload with the new 'results' format
      const payload = {
        routineId: routine.id,
        date: new Date().toISOString(),
        results: resultsPayload, // Use the new descriptive array
      };

      // 3. The fetch request remains the same, sending the new payload
      const res = await fetch("/api/routine-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!res.ok) {
        // Try to parse the error message from the server response
        const errorData = await res.json();
        throw new Error(errorData.error || "Ocurrió un error en el servidor.");
      }

      onBack();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error en el servidor."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // The JSX for rendering the component remains exactly the same
  return (
    <div className="max-w-5xl mx-auto p-6">
      <button
        onClick={onBack}
        className="flex items-center text-[var(--secondary-text-color)] hover:text-[var(--primary-text-color)] mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-1" /> Volver a rutinas
      </button>

      <h1 className="text-3xl font-bold mb-2">{routine.name}</h1>
      {routine.description && (
        <p className="text-[var(--secondary-text-color)] mb-6">
          {routine.description}
        </p>
      )}

      <div className="space-y-8">
        {routine.exercises.map((ex) => (
          <div key={ex.id} className="p-4 border rounded-lg shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={ex.gif_url}
                alt={ex.name}
                className="w-24 h-24 rounded object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "https://placehold.co/96x96?text=Sin+imagen";
                }}
              />
              <div>
                <h2 className="text-xl font-semibold">
                  {capitalizeFirstLetter(ex.name)}
                </h2>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">Equipo:</span>{" "}
                  {capitalizeFirstLetter(ex.equipment)} <br />
                  <span className="font-semibold"> Músculos:</span>{" "}
                  {capitalizeFirstLetter(ex.target)}
                </p>
              </div>
            </div>
            {/* Encabezado de columnas */}
            <div className="grid grid-cols-4 gap-4 text-center font-bold mb-2 px-2">
              <span>Serie</span>
              <span>Peso</span>
              <span>Reps</span>
              <span>Finalizado</span>
            </div>

            {/* Filas de series */}
            <div className="space-y-2">
              {results[ex.id].map((series, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-4 gap-4 items-center px-2 py-2 bg-gray-900 rounded-lg shadow-sm"
                >
                  {/* Índice de serie */}
                  <span className="text-center text-white font-medium">
                    {idx + 1}
                  </span>
                  {/* Reps */}
                  <input
                    type="number"
                    value={series.actualReps}
                    min={0}
                    onChange={(e) =>
                      handleSeriesChange(
                        ex.id,
                        idx,
                        "actualReps",
                        +e.target.value
                      )
                    }
                    className="w-full px-3 py-2 text-center rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Reps"
                  />

                  {/* Peso */}
                  <input
                    type="number"
                    value={series.weight}
                    min={0}
                    onChange={(e) =>
                      handleSeriesChange(ex.id, idx, "weight", +e.target.value)
                    }
                    className="w-full px-3 py-2 text-center rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Peso (kg)"
                  />

                  {/* Finalizado */}
                  <label
                    className={`flex items-center justify-center space-x-2 px-4 py-2 rounded text-center cursor-pointer transition ${
                      series.completed
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    } text-white`}
                  >
                    <input
                      type="checkbox"
                      checked={series.completed}
                      onChange={(e) =>
                        handleSeriesChange(
                          ex.id,
                          idx,
                          "completed",
                          e.target.checked
                        )
                      }
                      className="form-checkbox hidden"
                    />
                    <span>
                      {series.completed ? "✓ Finalizado" : "Marcar finalizado"}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {error && <p className="text-red-500 text-center mt-4">Error: {error}</p>}

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="mt-8 w-full px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
      >
        {isSubmitting ? "Enviando..." : "Finalizar rutina"}
      </button>
    </div>
  );
}

export default RoutineRunner;
