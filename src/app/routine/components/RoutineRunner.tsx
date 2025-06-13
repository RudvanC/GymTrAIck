"use client";

import { useState } from "react";
import type { Routine } from "@/app/api/base-routines/route";
import { ArrowLeft } from "lucide-react";

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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // The JSX for rendering the component remains exactly the same
  return (
    <div className="max-w-3xl mx-auto p-6">
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-1" /> Volver a rutinas
      </button>

      <h1 className="text-3xl font-bold mb-2">{routine.name}</h1>
      {routine.description && (
        <p className="text-gray-700 mb-6">{routine.description}</p>
      )}

      <div className="space-y-8">
        {routine.exercises.map((ex) => (
          <div key={ex.id} className="p-4 border rounded-lg shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={ex.gif_url}
                alt={ex.name}
                className="w-24 h-24 rounded"
              />
              <div>
                <h2 className="text-xl font-semibold">{ex.name}</h2>
                <p className="text-sm text-gray-500">
                  {ex.sets}×{ex.reps} · {ex.equipment} · {ex.target}
                </p>
              </div>
            </div>

            <div className="space-y-4 justify-around">
              {results[ex.id].map((series, idx) => (
                <div
                  key={idx}
                  className="flex justify-around gap-4 items-center"
                >
                  <span className="font-medium">Serie {idx + 1}</span>

                  <label className="flex items-center space-x-2">
                    <span>Reps:</span>
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
                      className="w-16 border rounded px-2 py-1"
                    />
                  </label>

                  <label className="flex items-center space-x-2">
                    <span>Peso (kg):</span>
                    <input
                      type="number"
                      value={series.weight}
                      min={0}
                      onChange={(e) =>
                        handleSeriesChange(
                          ex.id,
                          idx,
                          "weight",
                          +e.target.value
                        )
                      }
                      className="w-20 border rounded px-2 py-1"
                    />
                  </label>

                  <label className="flex items-center space-x-2">
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
                      className="form-checkbox"
                    />
                    <span>Hecho</span>
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
