//Esta funcion se encarga de guardar las respuestas del usuario
//e insertarlas en la base de datos
import { supabase } from "./supabase";

export async function insertUserAnswers(answers: {
  training_experience: string;
  availability: string;
  injuries: string;
  equipment_access: boolean;
  goal: string;
  fitness_level: string;
  session_duration: string;
}) {
  //Usamos el cliente supabase para apuntar a la tabla user_answers.
  //Insertamos un arreglo con el objeto answers que contiene las respuesta
  const { data, error } = await supabase.from("user_answers").insert([answers]);

  if (error) {
    throw new Error(error.message);
  }
  //Retornamos data con la respuesta del servidor, que será el registro insertado
  return data;
}
