/**
 * Renders the main dashboard page for authenticated users.
 *
 * This page displays a personalized summary and daily routine, using data fetched from the user's latest answers.
 * It includes conditional rendering of a profile card, an edit button, and a motivational "Today Routine" section.
 *
 * @remarks
 * The page uses a custom `useUserAnswers` hook (with SWR) to fetch the latest user data.
 * It shows different UI states depending on loading, error, or absence of user data.
 * Styling is applied using Tailwind CSS with dark mode enabled.
 *
 * @example
 * ```tsx
 * // Accessing /dashboard will render this page.
 * ```
 *
 * @returns A React element that represents the dashboard page UI.
 *
 * @see {@link useUserAnswers} - Custom hook for fetching and mutating user answer data.
 * @see {@link AnswerCard} - Displays the user's latest questionnaire result.
 * @see {@link EditAnswer} - Allows editing the latest answer.
 * @see {@link TodayRoutine} - Motivational CTA component rendered if data exists.
 */

"use client";

import { useUserAnswers } from "@/hooks/useUserAnswers";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { AnswerCard } from "@/app/dashboard/components/AnswerCard";
import { EditAnswer } from "@/app/dashboard/components/EditAnswer";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * `TodayRoutine` is a visual call-to-action component that promotes the user's daily training plan.
 *
 * It includes a motivational message and a link to the `/routine` page styled as a full-width button.
 * This component is shown only when the user has completed their initial questionnaire.
 *
 * @returns A React element encouraging the user to begin their daily workout.
 */
function TodayRoutine() {
  return (
    <div className="w-full flex flex-col justify-between p-8 border border-slate-800 rounded-2xl bg-slate-900 shadow-lg h-full hover:border-cyan-500/50 transition-colors duration-300">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Today's Routine</h2>
        <p className="text-slate-400 mb-6">
          Your personalized plan is ready. Let’s get to it!
        </p>
      </div>
      <Link href="/routine" passHref>
        <button className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500 text-slate-900 font-semibold rounded-lg transition-transform hover:scale-105 shadow-md hover:shadow-cyan-500/30">
          Start Training <ArrowRight className="w-5 h-5" />
        </button>
      </Link>
    </div>
  );
}

export default function DashboardPage() {
  const { answers, loading, error, mutate } = useUserAnswers();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-950">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-950">
        <p className="text-center text-red-500 font-semibold">
          Failed to load your profile: {error.message}
        </p>
      </div>
    );
  }

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
              Welcome back. Here’s your progress and today’s routine.
            </p>
          </div>

          {latestAnswer && (
            <EditAnswer currentAnswer={latestAnswer} onUpdate={mutate} />
          )}
        </header>

        <main className="flex flex-col gap-8 items-start">
          {latestAnswer ? (
            <AnswerCard answer={latestAnswer} />
          ) : (
            <div className="h-full flex items-center justify-center p-8 border border-dashed border-slate-700 rounded-2xl">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Welcome to your Dashboard!
                </h2>
                <p className="text-slate-400 mb-4">
                  It looks like you haven't completed our initial questionnaire
                  yet.
                </p>
                <Link href="/quiz" passHref>
                  <Button className="bg-cyan-500 hover:bg-cyan-600 text-slate-900">
                    Create My Training Plan
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {latestAnswer && <TodayRoutine />}
        </main>
      </div>
    </div>
  );
}
