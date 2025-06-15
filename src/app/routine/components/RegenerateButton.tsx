// components/RegenerateButton.tsx
"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function RegenerateButton() {
  const searchParams = useSearchParams();
  const answerId = searchParams.get("answer_id");
  const [loading, setLoading] = useState(false);

  if (!answerId) return null; // guard

  async function handleClick() {
    setLoading(true);
    const res = await fetch(`/api/regenerate-plan?answer_id=${answerId}`, {
      method: "POST",
    });
    setLoading(false);

    if (!res.ok) {
      alert("Error regenerando el plan");
      return;
    }
    /* Re-fetch the list (SWR will revalidate if you key by URL) */
    window.location.reload();
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
    >
      {loading ? "Generando..." : "Regenerar plan"}
    </button>
  );
}
