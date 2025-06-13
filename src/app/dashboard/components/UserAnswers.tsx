"use client";

import { useUserAnswers } from "@/hooks/useUserAnswers";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { AnswerCard } from "@/app/dashboard/components/AnswerCard";
import type { UserAnswer } from "@/types/UserAnswer"; // Importar el tipo centralizado

/**
 * Página del Dashboard que muestra las respuestas del usuario.
 */
export default function DashboardPage() {
  // Obtenemos las respuestas, el estado de carga y los errores.
  const { answers, loading, error } = useUserAnswers();

  // Muestra un spinner mientras se cargan los datos.
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Muestra un mensaje de error si la carga falla.
  if (error) {
    return (
      <p className="text-center mt-20 text-red-600 font-semibold">
        Error al cargar las respuestas: {error}
      </p>
    );
  }

  // Tomamos solo el set de respuestas más reciente (asumiendo que es el primero del array).
  const latestAnswer: UserAnswer | undefined = answers?.[0];

  // --- CORRECCIÓN CLAVE ---
  // Transformamos el objeto de respuesta en un array de objetos que `AnswerCard` pueda renderizar.
  // Cada propiedad del objeto 'latestAnswer' se convierte en una tarjeta individual.
  const displayableAnswers = latestAnswer
    ? [
        {
          id: `${latestAnswer.id}-goal`,
          question: "Objetivo Principal",
          answer: latestAnswer.goal,
        },
        {
          id: `${latestAnswer.id}-exp`,
          question: "Experiencia",
          answer: latestAnswer.training_experience,
        },
        {
          id: `${latestAnswer.id}-avail`,
          question: "Disponibilidad",
          answer: latestAnswer.availability,
        },
        {
          id: `${latestAnswer.id}-level`,
          question: "Nivel de Fitness",
          answer: latestAnswer.fitness_level,
        },
        {
          id: `${latestAnswer.id}-duration`,
          question: "Duración de Sesión",
          answer: `${latestAnswer.session_duration}`,
        },
        {
          id: `${latestAnswer.id}-injuries`,
          question: "Lesiones",
          answer:
            latestAnswer.injuries && latestAnswer.injuries.length > 0
              ? latestAnswer.injuries.join(", ")
              : "Ninguna",
        },
      ]
    : [];

  // Renderizado del contenido principal.
  return (
    <div className="max-w-6xl mx-auto pt-20 px-4">
      {/* Título de la página */}
      <h1 className="text-3xl font-extrabold mb-8 text-gray-800">
        Mis Respuestas
      </h1>

      {/* Renderizado condicional basado en si existen respuestas. */}
      {displayableAnswers.length === 0 ? (
        // Mensaje si no se encuentran respuestas.
        <p className="text-center text-gray-600 text-lg">
          No tienes respuestas registradas.
        </p>
      ) : (
        // Layout de rejilla para las tarjetas de respuesta.
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Mapeamos el array transformado y renderizamos una AnswerCard para cada una. */}
          {/* Ahora 'ans' tiene el formato correcto { id, question, answer } que AnswerCard espera. */}
          {displayableAnswers.map((ans) => (
            <AnswerCard key={ans.id} answer={ans} />
          ))}
        </div>
      )}
    </div>
  );
}
