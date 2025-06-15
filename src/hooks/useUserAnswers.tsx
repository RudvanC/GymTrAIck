"use client";
import { useEffect, useState, useCallback } from "react";
import { UserAnswer } from "@/types/UserAnswer";
import { useAuth } from "@/context/AuthContext";

/**
 * UserAnswersState
 *
 * Estructura del estado retornado por el hook `useUserAnswers`.
 */
export interface UserAnswersState {
  /** Lista de respuestas del usuario. */
  answers: UserAnswer[];

  /** Indicador de carga mientras se recuperan las respuestas. */
  loading: boolean;

  /** Mensaje de error en caso de que ocurra uno durante la carga de respuestas. */
  error: string | null;

  /** Función para volver a cargar las respuestas del usuario. */
  refetchAnswers: () => void;
}

/**
 * useUserAnswers
 *
 * Hook personalizado para obtener y gestionar las respuestas del usuario autenticado.
 * Utiliza `useAuth` para obtener el usuario actual y carga sus respuestas desde la API.
 *
 * @returns {UserAnswersState} Objeto con el estado de las respuestas del usuario, indicador de carga,
 * error y una función para recargar los datos.
 *
 * @example
 * const { answers, loading, error, refetchAnswers } = useUserAnswers();
 */
export function useUserAnswers(): UserAnswersState;

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
    } catch (err: unknown) {
      console.error("🧨 Error fetching user answers:", err);
      setError(
        err instanceof Error ? err.message : "Error al cargar las respuestas del usuario."
      );
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
