// components/RegenerateButton.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Loader } from "lucide-react"; // icono giratorio ligero

export default function RegenerateButton() {
  const searchParams = useSearchParams();
  const answerId = searchParams.get("answer_id");
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!answerId) return null; // guard – si no hay plan, no mostramos el botón

  async function regenerate() {
    setLoading(true);
    try {
      const res = await fetch(`/api/regenerate-plan?answer_id=${answerId}`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Error regenerando el plan");
      // Reload para reflejar cambios
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
      {/* BOTÓN PRINCIPAL */}
      <button
        onClick={() => setConfirmOpen(true)}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
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
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition"
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
