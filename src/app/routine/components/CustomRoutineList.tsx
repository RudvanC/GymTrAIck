"use client";
import useSWR, { mutate } from "swr";
import { useState } from "react";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import RoutineRunner from "./RoutineRunner";
import type { CustomRoutine } from "@/app/routine/types/all";
import { Trash2 } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function CustomRoutineList() {
  const { data: custom, error } = useSWR<CustomRoutine[]>(
    "/api/custom-routines",
    fetcher
  );

  const [selected, setSelected] = useState<CustomRoutine | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null); // id que estamos borrando
  const [errMsg, setErrMsg] = useState<string | null>(null);

  if (error)
    return <p className="text-red-500">Error cargando personalizadas</p>;
  if (!custom) return <LoadingSpinner />;

  if (selected) {
    return (
      <RoutineRunner routine={selected} onBack={() => setSelected(null)} />
    );
  }

  const deleteRoutine = async (id: string) => {
    if (!window.confirm("¿Eliminar esta rutina? Esta acción es irreversible."))
      return;

    setDeletingId(id);
    setErrMsg(null);
    try {
      const res = await fetch(`/api/custom-routines?routine_id=${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Error eliminando la rutina");
      }

      // refresca solo esta clave SWR
      mutate("/api/custom-routines");
    } catch (e) {
      setErrMsg(e instanceof Error ? e.message : "Error eliminando la rutina");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      {errMsg && (
        <p className="text-red-500 text-sm mb-4 text-center">{errMsg}</p>
      )}

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {custom.map((r) => (
          <section
            key={r.id}
            className="relative bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg transition group"
          >
            {/* Botón eliminar (esquina) */}
            <div className="flex w-full justify-between">
              {/* Contenido tarjeta */}
              <h2
                className="text-xl font-bold text-white mb-2 cursor-pointer"
                onClick={() => setSelected(r)}
              >
                {r.name}
              </h2>
              <button
                title="Eliminar rutina"
                disabled={deletingId === r.id}
                onClick={() => deleteRoutine(r.id)}
                className=" p-1 rounded hover:bg-red-600/20 text-red-400 hover:text-red-500 disabled:opacity-50"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            {r.description && (
              <p
                className="text-sm text-gray-400 mb-4 cursor-pointer"
                onClick={() => setSelected(r)}
              >
                {r.description}
              </p>
            )}

            <span className="inline-block text-xs bg-yellow-600 text-white px-2 py-0.5 rounded">
              Personalizada
            </span>
          </section>
        ))}
      </div>
    </>
  );
}
