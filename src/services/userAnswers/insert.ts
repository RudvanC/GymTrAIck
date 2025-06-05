import { supabase } from "../supabase";

// Defines the expected structure of the answers object to be inserted.
// This should align with the columns in the 'user_answers' table.
interface UserAnswersPayload {
  user_id: string;
  training_experience: string;
  availability: string; // Stored as string, validated as numeric string on client
  injuries: string;
  equipment_access: boolean;
  goal: string;
  fitness_level: string;
  session_duration: string; // Stored as string, validated as numeric string on client
  // created_at is typically handled by the database (e.g., default now())
}

/**
 * Inserts a new set of user answers into the Supabase database.
 *
 * @param answers - An object containing the user's answers, matching the UserAnswersPayload interface.
 * @returns A promise that resolves to the data returned by Supabase upon successful insertion (usually an array with the inserted record).
 *          Throws an error if the Supabase insert operation fails.
 */
export async function insertUserAnswers(answers: UserAnswersPayload) {
  // Perform an insert operation into the 'user_answers' table.
  // Supabase expects an array of objects to insert.
  const { data, error } = await supabase.from("user_answers").insert([answers]);

  // If an error occurs during the database insert, throw an error.
  if (error) {
    console.error("Error inserting user answers:", error);
    throw new Error(
      error.message || "Failed to save user answers to the database."
    );
  }

  // If successful, return the data from the insert operation.
  // This typically includes the newly created record.
  return data;
}
