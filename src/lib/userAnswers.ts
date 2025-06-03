//Esta funcion se encarga de guardar las respuestas del usuario
//e insertarlas en la base de datos
import { supabase } from "./supabase";

export async function insertUserAnswers(answers: {
  experience: string;
  availability: string;
  injuries: string;
  equipmentAccess: string;
  goal: string;
  fitnessLevel: string;
  sessionDuration: string;
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
