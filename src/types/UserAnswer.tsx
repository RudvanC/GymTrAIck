/**
 * @file Defines types related to the user's answers to the fitness questionnaire.
 *
 * @suggestion Consider renaming this file to `UserAnswer.ts` since it only contains type definitions.
 */

/**
 * Available training experience levels.
 * Using string literals improves type safety.
 */
export type TrainingExperienceType =
  | "none"
  | "little"
  | "moderate"
  | "advanced";

/**
 * Possible training goals the user can select.
 */
export type GoalType =
  | "muscle_gain"
  | "fat_loss"
  | "maintenance"
  | "general_health"
  | "strength_increase";

/**
 * Types of injuries or physical limitations a user may have.
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
 * Valid options for preferred session duration.
 */
export type SessionDurationType =
  | "15min"
  | "30min"
  | "45min"
  | "60min"
  | "90min"
  | "120min";

/**
 * Self-assessed fitness levels available to the user.
 */
export type FitnessLevelType =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "athlete";

/**
 * Represents a complete response from a user to the training questionnaire.
 *
 * @property id - Unique identifier for the response (usually a UUID).
 * @property created_at - ISO timestamp of when the response was submitted.
 * @property training_experience - Declared training experience level.
 * @property availability - Number of days per week the user can train (stored as a string).
 * @property injuries - List of declared injuries or limitations (can be empty).
 * @property equipment_access - Whether the user has access to gym equipment.
 * @property goal - User’s primary fitness goal.
 * @property fitness_level - User's current fitness level.
 * @property session_duration - Preferred duration of each workout session.
 *
 * @remarks
 * The `user_id` field might be used in database operations,
 * but it is not necessarily included in this base type.
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
