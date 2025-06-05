"use client";
import { useEffect, useState, useCallback } from "react";
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
    if (authLoading) return;

    if (!authUser) {
      setError("Usuario no autenticado");
      setLoading(false);
      setAnswers([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/user-answers?user_id=${authUser?.id}`);

      if (!res.ok) {
        let errData: { error?: string } = {};
        try {
          errData = await res.json();
        } catch {
          // Si no se puede parsear, deja errData vacío
        }
        console.error("🧨 Respuesta del servidor:", errData);
        throw new Error(
          typeof errData.error === "string" && errData.error.length > 0
            ? errData.error
            : "Error desconocido del servidor"
        );
      }

      const fetchedAnswers = await res.json();
      setAnswers(fetchedAnswers || []);
    } catch (err: any) {
      console.error("🧨 Error fetching user answers:", err);
      setError(err.message || "Error al cargar las respuestas del usuario.");
      setAnswers([]);
    } finally {
      setLoading(false);
    }
  }, [authUser, authLoading]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    answers,
    loading: loading || authLoading,
    error,
    refetchAnswers: loadData,
  };
}
