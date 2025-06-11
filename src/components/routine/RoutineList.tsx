"use client";

import { useState } from "react";
import useSWR from "swr";
import type { Routine } from "@/app/api/base-routines/route";
import LoadingSpinner from "../common/LoadingSpinner";
import { ChevronDown, ChevronUp } from "lucide-react";

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
  const [openId, setOpenId] = useState<string | null>(null);

  if (error) return <p className="text-red-500">Error cargando rutinas</p>;
  if (isLoading || !data) return <LoadingSpinner />;

  return (
    <div className="grid gap-6">
      {data.map((routine) => {
        const expanded = openId === routine.id;
        return (
          <div
            key={routine.id}
            className="border rounded-lg shadow hover:shadow-lg transition overflow-hidden"
          >
            <button
              className="w-full flex justify-between items-center p-6 bg-white"
              onClick={() => setOpenId(expanded ? null : routine.id)}
            >
              <div className="text-left">
                <h2 className="text-xl text-black font-semibold">
                  {routine.name}
                </h2>
                {routine.description && (
                  <p className="text-gray-500 text-sm">{routine.description}</p>
                )}
              </div>
              <div>
                {expanded ? (
                  <ChevronUp className="w-6 h-6 text-gray-600" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-600" />
                )}
              </div>
            </button>

            {expanded && (
              <ul className="bg-gray-50 p-6 space-y-4">
                {routine.exercises.map((ex) => (
                  <li key={ex.id} className="flex items-center space-x-4">
                    <img
                      src={ex.gif_url}
                      alt={ex.name}
                      className="w-12 h-12 rounded"
                    />
                    <div>
                      <p className="text-black font-medium">{ex.name}</p>
                      <p className="text-sm text-gray-500">
                        {ex.sets}×{ex.reps} · {ex.equipment} · {ex.target}
                      </p>
                      <p className="text-xs text-gray-400">
                        Secondary: {ex.secondary_muscles}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
