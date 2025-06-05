import { supabase } from "@/lib/supabase";
import { UserAnswer } from "@/types/UserAnswer";

/**
 * Fetches all questionnaire answers for a specific user from the Supabase database.
 * The answers are ordered by creation date, with the most recent first.
 *
 * @param userId - The ID of the user whose answers are to be fetched.
 * @returns A promise that resolves to an array of UserAnswer objects, or null if no data.
 *          Throws an error if the Supabase query fails.
 */
export async function fetchUserAnswersByUserId(
  userId: string
): Promise<UserAnswer[] | null> {
  const { data, error } = await supabase
    .from("user_answers")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user answers:", error);
    throw new Error(
      error.message || "Failed to fetch user answers from the database."
    );
  }
  return data;
}
