"use client";
import useSWR, { mutate } from "swr";
import { useState } from "react";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import RoutineRunner from "./RoutineRunner";
import type { CustomRoutine } from "@/app/routine/types/all";
import { Trash2 } from "lucide-react";
import AddCustomRoutineDialog from "./AddCustomRoutineDialog";
import { Button } from "@/components/ui/button";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function CustomRoutineList() {
  const { data: custom, error } = useSWR<CustomRoutine[]>(
    "/api/custom-routines",
    fetcher
  );

  const [selected, setSelected] = useState<CustomRoutine | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [routineToDelete, setRoutineToDelete] = useState<CustomRoutine | null>(
    null
  );

  if (error)
    return <p className="text-red-500">Error cargando personalizadas</p>;
  if (!custom) return <LoadingSpinner />;

  if (selected) {
    return (
      <RoutineRunner routine={selected} onBack={() => setSelected(null)} />
    );
  }

  const deleteRoutine = async (id: string) => {
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

      mutate("/api/custom-routines");
      setOpen(false); // cerrar modal
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
        {custom.length === 0 ? (
          <div>
            <p className="text-2xl font-semibold text-white mb-2">
              No tienes rutinas personalizadas
            </p>
            <p className="text-sm text-gray-400 mb-4">
              Puedes crear una rutina personalizada para tus necesidades.
            </p>
            <AddCustomRoutineDialog />
          </div>
        ) : (
          <>
            <p className="text-2xl font-semibold text-white mb-2 col-span-full">
              Rutinas personalizadas
            </p>

            {custom.map((r) => (
              <section
                key={r.id}
                className="relative bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg transition group"
              >
                <div className="flex w-full justify-between">
                  <h2
                    className="text-xl font-bold text-white mb-2 cursor-pointer"
                    onClick={() => setSelected(r)}
                  >
                    {r.name}
                  </h2>
                  <button
                    title="Eliminar rutina"
                    onClick={() => {
                      setOpen(true);
                      setRoutineToDelete(r);
                    }}
                    className="p-1 rounded hover:bg-red-600/20 text-red-400 hover:text-red-500"
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

                <span className="text-xs bg-yellow-600 text-white px-2 py-0.5 rounded ">
                  Personalizada
                </span>
                <Button
                  onClick={() => setSelected(r)}
                  className="border border-gray-700 bg-gray-900 hover:bg-green-600 hover:text-white justify-self-end flex"
                >
                  Empezar
                </Button>
              </section>
            ))}
          </>
        )}
      </div>

      {/* ✅ MODAL CONFIRMACIÓN GLOBAL */}
      {open && routineToDelete && (
        <div className="fixed inset-0 bg-gray-900/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-sm text-center">
            <h2 className="text-white text-xl font-semibold mb-4">
              ¿Eliminar rutina?
            </h2>
            <p className="text-gray-400 mb-6">
              Esta acción no se puede deshacer. ¿Estás seguro?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white"
              >
                Cancelar
              </button>
              <button
                onClick={() => deleteRoutine(routineToDelete.id)}
                disabled={deletingId === routineToDelete.id}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
              >
                {deletingId === routineToDelete.id
                  ? "Eliminando..."
                  : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
