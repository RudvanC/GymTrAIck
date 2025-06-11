/**
 * @file Define los tipos relacionados con las respuestas del usuario al cuestionario de entrenamiento.
 *
 * @suggestion Renombrar este archivo a `UserAnswer.ts` ya que solo contiene definiciones de tipos.
 */

/**
 * Tipos de experiencia en entrenamiento disponibles.
 * Usar literales de string mejora la seguridad de tipo.
 */
export type TrainingExperienceType =
  | "none"
  | "little"
  | "moderate"
  | "advanced";

/**
 * Objetivos de entrenamiento posibles para el usuario.
 */
export type GoalType =
  | "muscle_gain"
  | "fat_loss"
  | "maintenance"
  | "general_health"
  | "strength_increase";

/**
 * Tipos de lesiones o limitaciones físicas que puede tener el usuario.
 */
export type Injuries =
  | "none"
  | "knee"
  | "back"
  | "shoulder"
  | "ankle"
  | "wrist"
  | "other";

/**
 * Duraciones posibles para una sesión de entrenamiento.
 */
export type SessionDurationType =
  | "15min"
  | "30min"
  | "45min"
  | "60min"
  | "90min"
  | "120min";

/**
 * Niveles de condición física autoevaluados por el usuario.
 */
export type FitnessLevelType =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "athlete";

/**
 * Representa una respuesta completa del usuario al cuestionario de entrenamiento.
 *
 * @property id - Identificador único de la respuesta (por lo general UUID).
 * @property created_at - Fecha y hora en formato ISO cuando se envió la respuesta.
 * @property training_experience - Nivel de experiencia declarado.
 * @property availability - Días por semana disponibles para entrenar. Se guarda como string.
 * @property injuries - Lista de lesiones declaradas (puede estar vacía).
 * @property equipment_access - Si el usuario tiene acceso a equipamiento de gimnasio.
 * @property goal - Objetivo principal de entrenamiento.
 * @property fitness_level - Nivel actual de condición física del usuario.
 * @property session_duration - Duración preferida para las sesiones.
 *
 * @remarks
 * El campo `user_id` puede ser utilizado en operaciones de base de datos,
 * aunque no necesariamente está incluido en este tipo base.
 */
export interface UserAnswer {
  id: string;
  created_at: string;
  training_experience: TrainingExperienceType;
  availability: string;
  injuries: Injuries[];
  equipment_access: boolean;
  goal: GoalType;
  fitness_level: FitnessLevelType;
  session_duration: SessionDurationType;
}
