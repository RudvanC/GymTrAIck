/**
 * @module api/exercises
 * @description Este módulo define una ruta de API de Next.js para obtener una lista de ejercicios desde Supabase.
 * Utiliza el cliente de Supabase para interactuar con la base de datos y `NextResponse` para devolver la respuesta JSON.
 * Las credenciales de Supabase se configuran mediante variables de entorno para mayor seguridad.
 */

import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

/**
 * @constant {string} SUPABASE_URL La URL del proyecto Supabase, obtenida de las variables de entorno.
 */
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
/**
 * @constant {string} SUPABASE_ANON_KEY La clave pública "anon" de Supabase, obtenida de las variables de entorno.
 */
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

/**
 * @constant {SupabaseClient} supabase El cliente de Supabase inicializado con la URL y la clave anónima.
 */
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * @function GET
 * @description Manejador para las peticiones HTTP GET a esta ruta de API.
 * Realiza una petición a la tabla 'exercises' en Supabase para obtener los primeros 10 registros.
 * Si la petición es exitosa, devuelve los datos de los ejercicios en formato JSON.
 * Si ocurre un error, registra el error y devuelve una respuesta de error con un estado 500.
 * @returns {Promise<NextResponse>} Una promesa que resuelve con un objeto `NextResponse`
 * que contiene los datos de los ejercicios o un mensaje de error.
 */
export async function GET() {
  try {
    // Consulta a la tabla 'exercises', seleccionando todos los campos,
    // ordenando por 'id' de forma ascendente y limitando a los 10 primeros resultados.
    const { data: exercises, error } = await supabase
      .from("exercises")
      .select("*")
      .order("id", { ascending: true }) // Asume que tienes una columna 'id' para ordenar
      .limit(10);

    if (error) {
      console.error("Error fetching exercises from Supabase:", error);
      return NextResponse.json(
        { error: "Error fetching exercises from database" },
        { status: 500 }
      );
    }

    return NextResponse.json(exercises);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
