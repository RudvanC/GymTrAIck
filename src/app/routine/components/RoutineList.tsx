/**
 * RoutineList
 *
 * This component fetches and displays a list of recommended routines based on a user's answer ID.
 * It allows the user to:
 * - View all routines recommended for a specific `answerId`
 * - Start (run) a selected routine using the `RoutineRunner`
 * - Delete individual routines via `DeleteRoutineButton`
 *
 * Props:
 * @param answerId - The ID of the user answer that routines are associated with
 *
 * Features:
 * - Uses SWR for data fetching and loading state
 * - Gracefully handles error, loading, and empty states
 * - Displays muscle groups and exercise count per routine
 */

"use client";

import useSWR from "swr";
import { useState } from "react";
import type { Routine } from "@/app/api/recommend-routines-by-answer/route";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { DeleteRoutineButton } from "@/app/routine/components/DeleteRoutineButton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  });

interface RoutineListProps {
  answerId: string | null;
}

export default function RoutineList({ answerId }: RoutineListProps) {
  const router = useRouter();
  const { data, error, isLoading } = useSWR<Routine[]>(
    answerId ? `/api/recommend-routines-by-answer?answer_id=${answerId}` : null,
    fetcher
  );

  if (error)
    return (
      <p className="text-red-500">Error loading routines: {error.message}</p>
    );
  if (isLoading) return <LoadingSpinner />;
  if (!data || data.length === 0)
    return (
      <p className="text-gray-400">
        No routines found. Try generating a new plan.
      </p>
    );

  const capitalizeFirstLetter = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

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
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl font-bold text-white">{routine.name}</h2>
              {answerId && (
                <DeleteRoutineButton
                  answerId={answerId}
                  routineId={routine.id}
                />
              )}
            </div>

            {routine.description && (
              <p className="text-sm text-gray-400 mb-4">
                {routine.description}
              </p>
            )}

            <div className="mt-auto flex justify-between items-end">
              <div>
                <p className="text-sm text-gray-300">
                  🏋️ Ejercicios:{" "}
                  <span className="font-medium text-white">
                    {routine.exercises.length}
                  </span>
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  💪 Musculos:{" "}
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
                onClick={() =>
                  router.push(`/routine/base-runner/${routine.id}`)
                }
                className="border border-gray-700 bg-gray-900 hover:bg-green-600 hover:text-white justify-self-end flex"
              >
                Iniciar
              </Button>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
