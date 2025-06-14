/* app/(protected)/routine/page.tsx */
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import RoutineList from "@/app/routine/components/RoutineList";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/supabaseClient";
import { useAuth } from "@/context/AuthContext";

const fetcher = (url: string) =>
  fetch(url).then(async (res) => {
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  });

export default function RoutinePage() {
  /* ───── hooks y cliente ───── */
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();
  const { user } = useAuth();

  /* ───── estado interno ───── */
  const answerId = searchParams.get("answer_id");
  const [checkingLast, setCheckingLast] = useState(false);

  /* ───── SWR: rutinas recomendadas ───── */
  const {
    data: routines,
    error,
    isLoading,
  } = useSWR(
    answerId ? `/api/recommend-routines-by-answer?answer_id=${answerId}` : null,
    fetcher
  );

  /* ───── Effect: buscar último answer si falta ───── */
  useEffect(() => {
    if (answerId || !user) return; // ya tenemos parámetro o no hay sesión

    // 1) Intentar localStorage (más rápido)
    const stored = localStorage.getItem("last_answer_id");
    if (stored) {
      router.replace(`/routine?answer_id=${stored}`);
      return;
    }

    // 2) Consultar el último cuestionario en BD
    const getLastAnswer = async () => {
      setCheckingLast(true);
      const { data, error } = await supabase
        .from("user_answers") // tu tabla existente
        .select("id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      setCheckingLast(false);

      if (error) {
        console.error("Error buscando last_answer_id:", error);
        return;
      }
      if (data?.id) {
        // guarda en localStorage para la próxima vez
        localStorage.setItem("last_answer_id", data.id);
        router.replace(`/routine?answer_id=${data.id}`);
      }
    };

    getLastAnswer();
  }, [answerId, user, supabase, router]);

  /* ───── estados intermedios ───── */
  if (!user || isLoading || checkingLast) {
    return (
      <div className="p-8 text-gray-600 max-w-xl mx-auto">
        Cargando rutinas…
      </div>
    );
  }

  /* ───── sin parámetro y sin last_answer_id ───── */
  if (!answerId) {
    return (
      <div className="p-8 text-gray-600 max-w-xl mx-auto">
        Falta el parámetro <code>answer_id</code>. Completa primero el
        cuestionario de preferencias.
      </div>
    );
  }

  /* ───── error de API ───── */
  if (error) {
    return (
      <div className="p-8 text-red-600 max-w-xl mx-auto">
        Error al cargar rutinas: {error.message}
      </div>
    );
  }

  /* ───── sin rutinas compatibles ───── */
  if (!routines || routines.length === 0) {
    return (
      <div className="p-8 text-gray-600 max-w-xl mx-auto">
        No se encontraron rutinas para el ID proporcionado.
      </div>
    );
  }

  /* ───── render final ───── */
  return (
    <div className="max-w-7xl mx-auto p-8">
      <RoutineList answerId={answerId} />
    </div>
  );
}
