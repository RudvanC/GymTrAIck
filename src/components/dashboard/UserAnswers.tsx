"use client";

import { useUserAnswers } from "@/hooks/useUserAnswers";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { AnswerCard } from "./AnswerCard";

// UserAnswers component: Fetches and displays a list of the user's answers.
export default function UserAnswers() {
  // Fetches answers, loading state, and error state from the custom hook.
  const { answers, loading, error } = useUserAnswers();

  // Display loading spinner while data is being fetched.
  if (loading) return <LoadingSpinner />;

  // Display an error message if fetching fails.
  // Consider a more user-friendly error component or retry mechanism here.
  if (error) {
    return (
      <p className="text-center mt-20 text-red-600 font-semibold">
        Error al cargar las respuestas: {error}
      </p>
    );
  }

  // Main content rendering.
  return (
    <div className="max-w-6xl mx-auto pt-20 px-4">
      {/* Page title */}
      <h1 className="text-3xl font-extrabold mb-8 text-purple-200">
        Mis respuestas  
      </h1>

      {/* Conditional rendering based on whether answers exist. */}
      {answers.length === 0 ? (
        // Message displayed if no answers are found.
        <p className="text-center text-gray-600 text-lg">
          No tienes respuestas registradas.
        </p>
      ) : (
        // Grid layout for displaying answer cards.
        // Responsive columns: 1 for small, 2 for medium, 3 for large screens.
        <div className="flex flex-col gap-6">
          {/* Map through the answers array and render an AnswerCard for each. */}
          {/* Using ans.id as key is crucial for React's rendering performance and state management. */}
          {answers.map((ans) => (
            <AnswerCard key={ans.id} answer={ans} />
          ))}
        </div>
      )}
    </div>
  );
}
