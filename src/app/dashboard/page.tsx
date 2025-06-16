"use client";

import { useUserAnswers } from "@/hooks/useUserAnswers";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { AnswerCard } from "@/app/dashboard/components/AnswerCard";
import {
  goalMap,
  fitnessLevelMap,
  trainingExperienceMap,
  formatInjuries,
  formatSessionDuration,
} from "@/lib/formatAnswer";

// Define la estructura de los datos que vienen del hook 'useUserAnswers'.
interface UserAnswer {
  id: string;
  goal: string;
  training_experience: string;
  availability: string;
  fitness_level: string;
  session_duration: string;
  injuries: string[];
}

/**
 * Componente Placeholder para la sección "Rutina de hoy".
 */
function TodayRoutine() {
  return (
    <div className="p-6 border border-green-300 rounded-2xl">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Rutina de hoy</h2>
      <div className="border-2 border-dashed border-blue-300 rounded-xl min-h-[40vh] flex items-center justify-center">
        <p className="text-blue-600 font-medium">
          Aquí se mostrará el contenido de la rutina...
        </p>
      </div>
    </div>
  );
}

/**
 * Página principal del Dashboard que organiza el layout.
 */
export default function DashboardPage() {
  // Obtenemos las respuestas, el estado de carga y los errores.
  const { answers, loading, error } = useUserAnswers();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center mt-20 text-red-600 font-semibold">
        Error al cargar las respuestas: {error}
      </p>
    );
  }

  // Tomamos solo el set de respuestas más reciente (asumiendo que es el primero del array).
  const latestAnswer: UserAnswer | undefined = answers?.[0];

  // Transformamos el objeto de respuesta en un array de objetos que `AnswerCard` pueda renderizar.
  const displayableAnswers = latestAnswer
    ? [
        {
          id: `${latestAnswer.id}-goal`,
          question: "Objetivo Principal",
          answer: goalMap[latestAnswer.goal],
        },
        {
          id: `${latestAnswer.id}-exp`,
          question: "Experiencia",
          answer: trainingExperienceMap[latestAnswer.training_experience],
        },
        {
          id: `${latestAnswer.id}-avail`,
          question: "Disponibilidad",
          answer: `${latestAnswer.availability} Días` || "0 Días",
        },
        {
          id: `${latestAnswer.id}-level`,
          question: "Nivel de Fitness",
          answer: fitnessLevelMap[latestAnswer.fitness_level],
        },
        {
          id: `${latestAnswer.id}-duration`,
          question: "Duración de Sesión",
          answer: formatSessionDuration(latestAnswer.session_duration),
        },
        {
          id: `${latestAnswer.id}-injuries`,
          question: "Lesiones",
          answer: formatInjuries(latestAnswer.injuries),
        },
      ]
    : [];

  // Dividimos el nuevo array para distribuirlo en el layout.
  const topAnswers = displayableAnswers.slice(0, 4);
  const sideAnswers = displayableAnswers.slice(4);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 -slate-50 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 flex flex-col gap-8">
          {topAnswers.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {/* Ahora 'ans' tiene el formato correcto { id, question, answer } */}
              {topAnswers.map((ans) => (
                <AnswerCard key={ans.id} answer={ans} />
              ))}
            </div>
          )}

          <TodayRoutine />
        </div>

        <div className="lg:col-span-1 flex flex-col gap-6">
          {sideAnswers.length > 0 ? (
            sideAnswers.map((ans) => (
              // Ahora 'ans' tiene el formato correcto { id, question, answer }
              <AnswerCard key={ans.id} answer={ans} />
            ))
          ) : (
            <div className="text-center text-slate-500 mt-4"></div>
          )}
        </div>
      </div>
    </div>
  );
}
