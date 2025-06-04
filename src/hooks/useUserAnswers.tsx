import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { fetchUserAnswersByUserId } from "@/lib/userAnswers/fetch";
import { UserAnswer } from "@/types/UserAnswer";
import { useAuth } from "./useAuth";

export interface UserAnswersState {
  answers: UserAnswer[];
  loading: boolean;
  error: string | null;
  refetchAnswers: () => void;
}

export function useUserAnswers(): UserAnswersState {
  const { user: authUser, loading: authLoading } = useAuth();
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (authLoading) {
      return;
    }

    if (!authUser) {
      setError("Usuario no autenticado. No se pueden cargar las respuestas.");
      setLoading(false);
      setAnswers([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const fetchedAnswers = await fetchUserAnswersByUserId(authUser.id);
      setAnswers(fetchedAnswers || []);
    } catch (err: any) {
      console.error("Error fetching user answers:", err);
      setError(err.message || "Error al cargar las respuestas del usuario.");
      setAnswers([]);
    } finally {
      setLoading(false);
    }
  }, [authUser, authLoading]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refetchAnswers = useCallback(() => {
    loadData();
  }, [loadData]);

  return { answers, loading: loading || authLoading, error, refetchAnswers };
}
