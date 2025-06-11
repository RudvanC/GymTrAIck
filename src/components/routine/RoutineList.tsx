"use client";

import useSWR from "swr";
import type { Routine } from "@/app/api/base-routines/route";

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

  if (error) return <p className="text-red-500">Error cargando rutinas</p>;
  if (!data) return <p>Cargando rutinas…</p>;

  return (
    <div className="grid gap-8">
      {data.map((routine) => (
        <section key={routine.id} className="p-6 border rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-2">{routine.name}</h2>
          {routine.description && (
            <p className="text-gray-600 mb-4">{routine.description}</p>
          )}
          <ul className="space-y-3">
            {routine.exercises.map((ex) => (
              <li key={ex.id} className="flex items-center space-x-4">
                <img
                  src={ex.gif_url}
                  alt={ex.name}
                  className="w-12 h-12 rounded"
                />
                <div>
                  <p className="font-medium">{ex.name}</p>
                  <p className="text-sm text-gray-500">
                    {ex.sets}×{ex.reps} · {ex.equipment} · {ex.target}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
