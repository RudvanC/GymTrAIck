/**
 * useUserAnswers Hook
 *
 * This hook provides access to the authenticated user's questionnaire answers.
 * It uses SWR for efficient data fetching, caching, and revalidation.
 *
 * Features:
 * - Automatically fetches answers after authentication.
 * - Includes loading and error states.
 * - Supports manual cache mutation with SWR.
 *
 * Usage:
 * const { answers, loading, error, mutate } = useUserAnswers();
 */

"use client";

import useSWR, { type MutatorCallback } from "swr";
import { UserAnswer } from "@/types/UserAnswer";
import { useAuth } from "@/context/AuthContext";

/**
 * UserAnswersState
 * Structure of the state returned by the `useUserAnswers` hook.
 */
export interface UserAnswersState {
  /** List of the authenticated user's answers. */
  answers: UserAnswer[];

  /** Indicates whether the data is still being loaded. */
  loading: boolean;

  /** Any error encountered while fetching the data. */
  error: Error | null;

  /** Function to manually refresh or mutate the data. */
  mutate: (
    data?: UserAnswer[] | Promise<UserAnswer[]> | MutatorCallback<UserAnswer[]>,
    options?: any
  ) => Promise<UserAnswer[] | undefined>;
}

/**
 * Generic fetcher used by SWR.
 * Throws an error if the response is not OK.
 */
const fetcher = async (url: string): Promise<UserAnswer[]> => {
  const res = await fetch(url);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to load user answers.");
  }
  return res.json();
};

/**
 * useUserAnswers
 *
 * Custom hook to retrieve and manage the current user's answers using SWR.
 * Handles caching, revalidation, and authentication context.
 */
export function useUserAnswers(): UserAnswersState {
  const { user: authUser, loading: authLoading } = useAuth();

  // Only call the API if the user is authenticated
  const swrKey = authUser ? "/api/user-answers" : null;

  const { data, error, isLoading, mutate } = useSWR(swrKey, fetcher, {
    shouldRetryOnError: false,
  });

  return {
    answers: data || [],
    loading: isLoading || authLoading,
    error,
    mutate,
  };
}
