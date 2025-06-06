// Suggestion: Rename this file to UserAnswer.ts as it only contains type definitions.

// Defines the possible string values for training experience.
// Using string literal types enhances type safety.
export type TrainingExperienceType =
  | "none"
  | "little"
  | "moderate"
  | "advanced";

// Defines the possible string values for user goals.
export type GoalType =
  | "muscle_gain"
  | "fat_loss"
  | "maintenance"
  | "general_health"
  | "strength_increase";

//Defines the possibñe string values for injuries
export type Injuries =
  | "none"
  | "knee"
  | "back"
  | "shoulder"
  | "ankle"
  | "wrist"
  | "other";

// Defines the possible string values for session duration.
export type SessionDurationType =
  | "15min"
  | "30min"
  | "45min"
  | "60min"
  | "90min"
  | "120min";

// Defines the possible string values for fitness levels.
export type FitnessLevelType =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "athlete";

/**
 * Interface representing the structure of a user's answers to the questionnaire.
 * This type is used across the application to ensure consistency when handling user answer data.
 */
export interface UserAnswer {
  id: string; // Unique identifier for the answer set (usually UUID from Supabase).
  created_at: string; // ISO date string representing when the answers were submitted.

  // Questionnaire responses:
  training_experience: TrainingExperienceType; // User's declared training experience.
  availability: string; // Number of days per week user can train (e.g., "3"). Stored as string.
  injuries: Injuries[]; // Description of any injuries or physical limitations. Empty string if none.
  equipment_access: boolean; // True if the user has access to gym equipment, false otherwise.
  goal: GoalType; // The user's primary training goal.
  fitness_level: FitnessLevelType; // User's self-assessed current fitness level.
  session_duration: SessionDurationType; // Preferred duration for a training session in minutes (e.g., "45"). Stored as string.

  // user_id is also part of the data model but might be handled separately or added if this type is used for DB representation directly.
  // For instance, when fetching, user_id is used for querying. When inserting, it's part of the payload.
}
