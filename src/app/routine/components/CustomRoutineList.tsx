"use client";
import useSWR from "swr";
import { useState } from "react";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import RoutineRunner from "./RoutineRunner"; // el mismo runner
import type { CustomRoutine } from "@/app/routine/types/all"; // le defines su shape

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function CustomRoutineList() {
  const { data: custom, error } = useSWR<CustomRoutine[]>(
    "/api/custom-routines",
    fetcher
  );

  const [selected, setSelected] = useState<CustomRoutine | null>(null);

  if (error)
    return <p className="text-red-500">Error cargando personalizadas</p>;
  if (!custom) return <LoadingSpinner />;

  if (selected) {
    return (
      <RoutineRunner routine={selected} onBack={() => setSelected(null)} />
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {custom.map((r) => (
        <section
          key={`C-${r.id}`}
          className="bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-md"
        >
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            {r.name}
            <span className="text-xs bg-yellow-600 text-white px-2 py-0.5 rounded">
              Personalizada
            </span>
          </h2>

          {r.description && (
            <p className="text-sm text-gray-400 mb-4">{r.description}</p>
          )}

          <button
            onClick={() => setSelected(r)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg"
          >
            Empezar rutina
          </button>
        </section>
      ))}
    </div>
  );
}
