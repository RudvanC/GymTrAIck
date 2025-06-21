/**
 * Represents the result of a single set within an exercise.
 */
export interface SeriesResult {
  /** Weight used during the set (in kilograms). */
  weight: number;

  /** Whether the set was completed. */
  completed: boolean;

  /** Actual number of repetitions performed. */
  actualReps: number;
}

/**
 * Represents the performance result of a single exercise in a routine.
 */
export interface ExerciseResult {
  /** List of sets completed for the exercise. */
  series: SeriesResult[];

  /** ID of the exercise performed. */
  exerciseId: number;

  /** Name of the exercise. */
  exerciseName: string;

  /** Target number of repetitions per set. */
  reps: number;
}

/**
 * Represents a full routine result completed by the user.
 */
export interface UserRoutineResult {
  /** Unique identifier for the result entry. */
  id: number;

  /** Timestamp when the routine was completed (ISO 8601 format). */
  completed_at: string;

  /** List of exercise results within the routine. */
  results: ExerciseResult[];

  /** ID of the original routine. */
  routine_id: string;

  /** Information about the base routine, if applicable. */
  base_routines: {
    /** Name of the base routine. */
    name: string;
  } | null;
}
