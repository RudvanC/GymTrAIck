import { useState } from "react";
import { Trash2 } from "lucide-react";
import useSWRMutation from "swr/mutation";
import { mutate } from "swr";

interface DeleteProps {
  answerId: string;
  routineId: string;
}

export function DeleteRoutineButton({ answerId, routineId }: DeleteProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { trigger, isMutating } = useSWRMutation(
    [
      `/api/recommend-routines-by-answer?answer_id=${answerId}&routine_id=${routineId}`,
    ],
    ([url]) => fetch(url, { method: "DELETE" })
  );

  async function handleDelete() {
    const res = await trigger();
    if (!res?.ok) {
      alert("Error eliminando la rutina");
      return;
    }
    // Revalida la key de tu listado principal
    mutate("/api/user-routines"); // o la key que uses en SWR

    setConfirmOpen(false);
    alert("Rutina eliminada");

    window.location.reload();
  }

  return (
    <>
      <button
        title="Eliminar rutina"
        className="p-2 rounded hover:bg-red-600/20 text-red-400 hover:text-red-500 transition"
        onClick={() => setConfirmOpen(true)}
        disabled={isMutating}
      >
        <Trash2 className="w-5 h-5" />
      </button>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-80 text-center">
            <h4 className="text-lg font-semibold text-white mb-2">
              ¿Eliminar rutina?
            </h4>
            <p className="text-sm text-gray-400 mb-6">
              Esta acción no se puede deshacer.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
              >
                Sí, eliminar
              </button>
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
