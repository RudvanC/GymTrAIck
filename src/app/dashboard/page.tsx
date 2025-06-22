"use client";

import { useUserAnswers } from "@/hooks/useUserAnswers";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { AnswerCard } from "@/app/dashboard/components/AnswerCard";
import { EditAnswer } from "@/app/dashboard/components/EditAnswer";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import UserInfo from "@/app/dashboard/components/UserInfo";

function TodayRoutine() {
  // Este componente interno ya es bastante responsive con w-full y h-full,
  // se adaptará bien a nuestro nuevo grid.
  return (
    <div className="w-full flex flex-col justify-between p-6 md:p-8 border border-slate-800 rounded-2xl bg-slate-900 shadow-lg h-full hover:border-cyan-500/50 transition-colors duration-300">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Rutina diaria
        </h2>
        <p className="text-slate-400 mb-6">
          Tu plan personalizado está listo. ¡Vamos a ello!
        </p>
      </div>
      <Link href="/routine" passHref>
        <button className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold shadow-md hover:shadow-cyan-600/30 transition-all duration-300">
          Iniciar entrenamiento <ArrowRight className="w-5 h-5" />
        </button>
      </Link>
    </div>
  );
}

export default function DashboardPage() {
  const { answers, loading, error, mutate } = useUserAnswers();

  if (loading) {
    return (
      <div className="flex justify-center items-center bg-slate-950">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center bg-slate-950 p-4">
        <p className="text-center text-red-500 font-semibold">
          No se pudo cargar tu perfil: {error.message}
        </p>
      </div>
    );
  }

  const latestAnswer = answers?.[0];

  return (
    <div className=" text-slate-50">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 md:space-y-10">
        {/* ===== 1. CABECERA RESPONSIVE ===== */}
        <header className="flex flex-col gap-4 md:flex-row md:justify-between md:items-start">
          {/* - flex-col: En móvil, el título y el botón se apilan.
              - md:flex-row: En pantallas medianas y más, vuelven a estar en fila.
          */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Dashboard
            </h1>
            <p className="text-slate-400 mt-2">
              Bienvenido de vuelta. Aquí está tu progreso y tu rutina diaria.
            </p>
          </div>

          {latestAnswer && (
            <EditAnswer currentAnswer={latestAnswer} onUpdate={mutate} />
          )}
        </header>

        {/* ===== 2. CONTENIDO PRINCIPAL CON GRID RESPONSIVE ===== */}
        <main className="flex flex-col gap-20 items-start">
          {/* - grid-cols-1: En móvil, una sola columna (las tarjetas se apilan).
              - lg:grid-cols-2: En pantallas grandes, dos columnas (las tarjetas se ponen lado a lado).
              - gap-8: Espacio entre las tarjetas.
              - items-start: Alinea las tarjetas en la parte superior de su celda del grid.
          */}

          {latestAnswer ? (
            <>
              <div className="flex flex-col w-full gap-6">
                <AnswerCard answer={latestAnswer} />
                <UserInfo />
                <TodayRoutine />
              </div>
            </>
          ) : (
            // Mensaje de bienvenida que ocupa todo el ancho
            <div className="h-full flex items-center justify-center p-8 border border-dashed border-slate-700 rounded-2xl lg:col-span-2">
              {/* - lg:col-span-2: Le decimos que ocupe las 2 columnas del grid en pantallas grandes.
               */}
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-white mb-2">
                  ¡Bienvenido a tu Dashboard!
                </h2>
                <p className="text-slate-400 mb-4">
                  Parece que aún no has completado nuestro cuestionario inicial.
                </p>
                <Link href="/quiz" passHref>
                  <Button className="bg-cyan-500 hover:bg-cyan-600 text-slate-900">
                    Crear mi plan de entrenamiento
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
