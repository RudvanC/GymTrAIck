// components/RegenerateButton.tsx

"use client";

import { useState } from "react";
import { Loader } from "lucide-react";

// El componente ahora espera recibir 'answerId' como una prop
interface RegenerateButtonProps {
  answerId: string | null;
}

export default function RegenerateButton({ answerId }: RegenerateButtonProps) {
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // La lógica para ocultarse sigue siendo la misma, pero ahora usa la prop
  if (!answerId) {
    return null;
  }

  async function regenerate() {
    setLoading(true);
    try {
      // La URL de la API se construye con el answerId recibido por props
      const res = await fetch(`/api/regenerate-plan?answer_id=${answerId}`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Error regenerando el plan");

      window.location.reload();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  }

  return (
    <>
      {/* El resto del JSX del botón y el modal no necesita cambios */}
      <button
        onClick={() => setConfirmOpen(true)}
        disabled={loading}
        className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 text-slate-900 font-semibold rounded-lg transition-transform hover:scale-105 shadow-md hover:shadow-cyan-500/30"
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <Loader className="w-4 h-4 animate-spin" /> Generando…
          </span>
        ) : (
          "Regenerar rutina"
        )}
      </button>

      {/* MODAL DE CONFIRMACIÓN */}
      {confirmOpen && !loading && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-[90%] max-w-sm shadow-lg text-center">
            <h4 className="text-lg font-semibold text-white mb-2">
              ¿Estás seguro?
            </h4>
            <p className="text-sm text-gray-400 mb-6">
              Esta acción reemplazará la rutina actual por una nueva.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={regenerate}
                className="px-4 py-2 bg-green-600 hover:bg-red-700 text-white rounded-md transition"
              >
                Sí, regenerar
              </button>

              <button
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition"
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
