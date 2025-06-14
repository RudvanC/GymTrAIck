// app/(protected)/routine/page.tsx   ← o la ruta donde tengas la página
"use client";

import { useSearchParams } from "next/navigation";
import RoutineList from "@/app/routine/components/RoutineList";
import useSWR from "swr";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  });

export default function RoutinePage() {
  const searchParams = useSearchParams();
  const answerId = searchParams.get("answer_id"); // ← "7cacba81-…" o null
  const { data, error } = useSWR(
    answerId ? `/api/recommend-routines-by-answer?answer_id=${answerId}` : null,
    fetcher
  );

  if (!answerId) {
    return (
      <div className="p-8 text-gray-600 max-w-xl mx-auto">
        Falta el parámetro <code>answer_id</code>. Completa primero el
        cuestionario de preferencias.
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-gray-600 max-w-xl mx-auto">
        No se encontraron respuestas para el ID proporcionado.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <RoutineList answerId={answerId} />
    </div>
  );
}
