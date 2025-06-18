// src/types/Progress.ts

export interface SeriesResult {
  weight: number;
  completed: boolean;
  actualReps: number;
}

export interface ExerciseResult {
  series: SeriesResult[];
  exerciseId: number;
  exerciseName: string;
  reps: number;
}

export interface UserRoutineResult {
  id: number;
  completed_at: string;
  results: ExerciseResult[];
  routine_id: string;
  base_routines: {
    name: string;
  } | null;
}
