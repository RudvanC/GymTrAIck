// src/app/dashboard/DashboardPage.tsx

"use client";

import { useUserAnswers } from "@/hooks/useUserAnswers";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { AnswerCard } from "@/app/dashboard/components/AnswerCard";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

function TodayRoutine() {
  // ... (El componente TodayRoutine no necesita cambios, pero lo he estilizado un poco más abajo)
  return (
    <div className="flex flex-col justify-between p-8 border border-slate-800 rounded-2xl bg-slate-900 shadow-lg h-full">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Rutina de Hoy</h2>
        <p className="text-slate-400 mb-6">
          Tu plan personalizado te está esperando. ¡A por todas!
        </p>
      </div>
      <Link href="/routine" passHref>
        <button className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500 text-slate-900 font-semibold rounded-lg transition-transform hover:scale-103 shadow-md hover:shadow-cyan-500/30">
          Empezar Entrenamiento <ArrowRight className="w-5 h-5" />
        </button>
      </Link>
    </div>
  );
}

export default function DashboardPage() {
  const { answers, loading, error } = useUserAnswers();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-950">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center mt-20 text-red-500 font-semibold">
        Error: {error}
      </p>
    );
  }

  const latestAnswer = answers?.[0];

  return (
    <div className="bg-slate-950 text-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-10">
        <header>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Dashboard
          </h1>
          <p className="text-slate-400 mt-2">
            Bienvenido de nuevo. Aquí tienes tu resumen y la rutina de hoy.
          </p>
        </header>

        {/* --- MEJORA DE LAYOUT --- */}
        {/* Usamos un grid que en pantallas grandes (lg) tiene 2 columnas */}
        <main className="gap-8 p-12 items-start">
          {latestAnswer ? (
            <AnswerCard answer={latestAnswer} />
          ) : (
            <div className="h-full flex items-center justify-center p-8 border border-dashed border-slate-700 rounded-2xl">
              <p className="text-center text-slate-500">
                Aún no has completado el cuestionario. ¡Rellénalo para obtener
                tu plan!
              </p>
            </div>
          )}

          <TodayRoutine />
        </main>
      </div>
    </div>
  );
}
