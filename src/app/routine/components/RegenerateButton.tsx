/**
 * RegenerateButton
 *
 * This component displays a button that allows the user to regenerate a workout plan based on an answer ID.
 * When clicked, it asks for confirmation and then sends a POST request to the API to generate a new plan.
 *
 * Props:
 * @param answerId - The ID of the current user answer used to regenerate the plan. If null, the button is not rendered.
 *
 * Features:
 * - Confirmation modal before triggering regeneration
 * - Loading state with spinner
 * - Reloads the page after successful regeneration
 */

"use client";

import { useState } from "react";
import { Loader } from "lucide-react";

interface RegenerateButtonProps {
  answerId: string | null;
}

export default function RegenerateButton({ answerId }: RegenerateButtonProps) {
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!answerId) return null;

  async function regenerate() {
    setLoading(true);
    try {
      const res = await fetch(`/api/regenerate-plan?answer_id=${answerId}`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Error regenerating the plan");

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
      <button
        onClick={() => setConfirmOpen(true)}
        disabled={loading}
        className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 text-slate-900 font-semibold rounded-lg transition-transform hover:scale-105 shadow-md hover:shadow-cyan-500/30"
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <Loader className="w-4 h-4 animate-spin" /> Generating…
          </span>
        ) : (
          "Regenerate Routine"
        )}
      </button>

      {confirmOpen && !loading && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-[90%] max-w-sm shadow-lg text-center">
            <h4 className="text-lg font-semibold text-white mb-2">
              Are you sure?
            </h4>
            <p className="text-sm text-gray-400 mb-6">
              This will replace your current routine with a new one.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={regenerate}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition"
              >
                Yes, regenerate
              </button>

              <button
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
