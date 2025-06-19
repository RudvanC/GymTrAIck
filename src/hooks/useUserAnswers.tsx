// src/hooks/useUserAnswers.ts

"use client";
import useSWR, { type MutatorCallback } from "swr"; // <-- 1. Importamos useSWR y el tipo MutatorCallback
import { UserAnswer } from "@/types/UserAnswer";
import { useAuth } from "@/context/AuthContext";

/**
 * UserAnswersState
 * Estructura del estado retornado por el hook `useUserAnswers`.
 */
export interface UserAnswersState {
  /** Lista de respuestas del usuario. */
  answers: UserAnswer[];

  /** Indicador de carga mientras se recuperan las respuestas. */
  loading: boolean;

  /** Mensaje de error en caso de que ocurra uno. */
  error: Error | null;

  /** Función para refrescar los datos manualmente. */
  mutate: (
    data?: UserAnswer[] | Promise<UserAnswer[]> | MutatorCallback<UserAnswer[]>,
    options?: any
  ) => Promise<UserAnswer[] | undefined>;
}

// 2. Definimos una función 'fetcher' que SWR usará para todas las peticiones.
const fetcher = async (url: string): Promise<UserAnswer[]> => {
  const res = await fetch(url);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({})); // Intenta parsear el error, si no, objeto vacío
    throw new Error(errorData.error || "Error al cargar los datos.");
  }
  return res.json();
};

/**
 * useUserAnswers
 *
 * Hook personalizado para obtener y gestionar las respuestas del usuario autenticado,
 * ahora potenciado por SWR para cacheo, revalidación y la función 'mutate'.
 */
export function useUserAnswers(): UserAnswersState {
  const { user: authUser, loading: authLoading } = useAuth();

  // 3. La 'key' de SWR. Si el usuario no está cargado (authUser es null),
  // SWR no hará la petición. ¡Esto maneja la autenticación por nosotros!
  //
  // NOTA IMPORTANTE: He quitado el `?user_id=...` de la URL.
  // Recuerda que hicimos que nuestro endpoint fuera más seguro obteniendo el ID
  // de la sesión en el servidor, así que ya no es necesario pasarlo.
  const swrKey = authUser ? "/api/user-answers" : null;

  // 4. La llamada principal al hook de SWR.
  const { data, error, isLoading, mutate } = useSWR(swrKey, fetcher, {
    // Opcional: configuración extra de SWR
    shouldRetryOnError: false, // No reintentar si la API da un error
  });

  return {
    // 5. Devolvemos un objeto con la misma "forma" que antes, pero con datos de SWR.
    answers: data || [], // Si 'data' aún no ha llegado, devolvemos un array vacío.
    loading: isLoading || authLoading, // La carga depende de SWR o de la autenticación.
    error,
    mutate, // ¡Aquí está la función que necesitas!
  };
}
