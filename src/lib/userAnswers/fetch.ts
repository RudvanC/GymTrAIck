import { supabase } from "../supabase";

export async function fetchUserAnswersByUserId(userId: string) {
  const { data, error } = await supabase
    .from("user_answers")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}
