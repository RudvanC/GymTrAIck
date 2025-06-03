import { supabase } from "../supabase";

export async function insertUserAnswers(answers: {
  user_id: string;
  training_experience: string;
  availability: string;
  injuries: string;
  equipment_access: boolean;
  goal: string;
  fitness_level: string;
  session_duration: string;
}) {
  const { data, error } = await supabase.from("user_answers").insert([answers]);

  if (error) {
    throw new Error(error.message);
  }
  return data;
}
