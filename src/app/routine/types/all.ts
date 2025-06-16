/* ----------------------------------------------------------------------
 * src/types/all.ts
 *
 * Archivo único con **TODOS** los tipos que la app necesita para rutinas y
 * ejercicios.  Así evitas colisiones de nombres y tienes un único punto de
 * verdad.
 *
 * 👉 Ejemplo de uso:
 *     import type { Routine, AnyRoutine, CustomRoutine, RecRoutine } from "@/types/all";
 * --------------------------------------------------------------------*/

// ──────────────────────────────────────────────────────────────────
// 1️⃣  Tipos base que expone el endpoint de rutinas recomendadas
// ------------------------------------------------------------------
export type RecRoutineBase =
  import("@/app/api/recommend-routines-by-answer/route").Routine;

export type RecExercise = RecRoutineBase["exercises"][number];

/**
 * RecRoutine: rutina proveniente del endpoint recomendadas.
 * Añadimos `isCustom?: false` para compartir propiedad con las personalizadas.
 */
export type RecRoutine = RecRoutineBase & { isCustom?: false };

// ──────────────────────────────────────────────────────────────────
// 2️⃣  Rutinas PERSONALIZADAS creadas por el usuario
// ------------------------------------------------------------------
export interface CustomExercise {
  /** PK de exercises.id (smallint) */
  id: number;
  name: string;
  target: string;
  sets: number;
  reps: number;

  /* Opcionales para alinear con RecExercise y evitar errores de acceso */
  gif_url?: string;
  equipment?: string;
  secondary_muscles?: string;
  sort_order?: number;
}

export interface CustomRoutine {
  /** UUID de user_custom_routines.id */
  id: string;
  slug?: string; // opcional para igualar con RecRoutine
  name: string;
  description: string | null;
  exercises: CustomExercise[];
  isCustom: true; // marca inequívoca
}

// ──────────────────────────────────────────────────────────────────
// 3️⃣  Uniones reutilizables
// ------------------------------------------------------------------
export type AnyExercise = RecExercise | CustomExercise;
export type AnyRoutine = RecRoutine | CustomRoutine;

/**
 * Alias genérico "Routine" para usar en componentes como RoutineRunner.
 *    Routine = RecRoutine | CustomRoutine
 */
export type Routine = AnyRoutine;

/**
 * Props estándar que puede usar RoutineRunner u otros componentes similares
 * para recibir una rutina de **cualquier** origen y una función de vuelta.
 */
export interface RoutineRunnerProps {
  routine: Routine;
  onBack: () => void;
}
