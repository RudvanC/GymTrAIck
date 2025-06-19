// src/app/dashboard/page.tsx (o donde esté tu DashboardPage)

"use client";

import { useUserAnswers } from "@/hooks/useUserAnswers";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { AnswerCard } from "@/app/dashboard/components/AnswerCard";
import { EditAnswer } from "@/app/dashboard/components/EditProfile";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Componente para la sección "Rutina de hoy", con un estilo mejorado.
function TodayRoutine() {
  return (
    <div className="w-full flex flex-col justify-between p-8 border border-slate-800 rounded-2xl bg-slate-900 shadow-lg h-full hover:border-cyan-500/50 transition-colors duration-300">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Rutina de Hoy</h2>
        <p className="text-slate-400 mb-6">
          Tu plan personalizado te está esperando. ¡A por todas!
        </p>
      </div>
      <Link href="/routine" passHref>
        <button className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500 text-slate-900 font-semibold rounded-lg transition-transform hover:scale-105 shadow-md hover:shadow-cyan-500/30">
          Empezar Entrenamiento <ArrowRight className="w-5 h-5" />
        </button>
      </Link>
    </div>
  );
}

// El componente principal de la página del dashboard.
export default function DashboardPage() {
  // 1. Usamos nuestro hook refactorizado con SWR para obtener los datos y la función 'mutate'.
  const { answers, loading, error, mutate } = useUserAnswers();

  // Estado de carga
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-950">
        <LoadingSpinner />
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-950">
        <p className="text-center text-red-500 font-semibold">
          Error al cargar tu perfil: {error.message}
        </p>
      </div>
    );
  }

  // Obtenemos la respuesta más reciente del usuario.
  const latestAnswer = answers?.[0];

  return (
    <div className="bg-slate-950 text-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-10">
        <header className="flex justify-between items-start gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Dashboard
            </h1>
            <p className="text-slate-400 mt-2">
              Bienvenido de nuevo. Aquí tienes tu resumen y la rutina de hoy.
            </p>
          </div>

          {/* 2. El botón de editar solo aparece si tenemos una respuesta para editar. */}
          {/* Le pasamos la respuesta actual y la función 'mutate' para que pueda refrescar. */}
          {latestAnswer && (
            <EditAnswer currentAnswer={latestAnswer} onUpdate={mutate} />
          )}
        </header>

        {/* El grid principal que organiza el contenido. */}
        <main className="flex flex-col gap-8 items-start">
          {/* 3. Renderizado Condicional: Mostramos la tarjeta de perfil o un mensaje de bienvenida. */}
          {latestAnswer ? (
            <AnswerCard answer={latestAnswer} />
          ) : (
            <div className="h-full flex items-center justify-center p-8 border border-dashed border-slate-700 rounded-2xl">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-white mb-2">
                  ¡Bienvenido a tu Dashboard!
                </h2>
                <p className="text-slate-400 mb-4">
                  Parece que aún no has completado nuestro cuestionario inicial.
                </p>
                <Link href="/quiz" passHref>
                  <Button className="bg-cyan-500 hover:bg-cyan-600 text-slate-900">
                    Crear mi Plan de Entrenamiento
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* La rutina de hoy solo se muestra si ya existe un plan (latestAnswer). */}
          {latestAnswer && <TodayRoutine />}
        </main>
      </div>
    </div>
  );
}




