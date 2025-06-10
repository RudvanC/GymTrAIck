/**
 * @module api/exercises
 * @description Este módulo define una ruta de API de Next.js para obtener una lista de ejercicios desde ExerciseDB.
 * Utiliza `axios` para realizar la petición a la API externa y `NextResponse` para devolver la respuesta JSON.
 * La clave de la API y el host se configuran mediante variables de entorno para una mayor seguridad.
 */

import axios from "axios";
import { NextResponse } from "next/server";

/**
 * @constant {string} API_HOST El host de la API de ExerciseDB.
 */
const API_HOST = "exercisedb.p.rapidapi.com";
/**
 * @constant {string} API_KEY La clave API para acceder a ExerciseDB, obtenida de las variables de entorno.
 * Se asume que `process.env.RAPIDAPI_KEY` siempre estará definida en el entorno de ejecución, de ahí el `as string`.
 */
const API_KEY = process.env.RAPIDAPI_KEY as string;

/**
 * @constant {object} options Opciones de configuración para la petición `axios` a ExerciseDB.
 * Incluye el método HTTP, la URL base, parámetros de consulta para limitar y compensar los resultados (por defecto 10 ejercicios, offset 0),
 * y las cabeceras necesarias para la autenticación con RapidAPI.
 */
const options = {
  method: "GET",
  url: "https://exercisedb.p.rapidapi.com/exercises",
  params: {
    limit: "10", // Número de ejercicios a obtener (por defecto 10)
    offset: "0", // Desde qué posición empezar a obtener (por defecto 0)
  },
  headers: {
    "x-rapidapi-key": API_KEY,
    "x-rapidapi-host": API_HOST,
  },
};

/**
 * @function GET
 * @description Manejador para las peticiones HTTP GET a esta ruta de API.
 * Realiza una petición a la API de ExerciseDB utilizando las opciones predefinidas.
 * Si la petición es exitosa, devuelve los datos de los ejercicios en formato JSON.
 * Si ocurre un error, registra el error y devuelve una respuesta de error con un estado 500.
 * @returns {Promise<NextResponse>} Una promesa que resuelve con un objeto `NextResponse`
 * que contiene los datos de los ejercicios o un mensaje de error.
 */
export async function GET() {
  try {
    const response = await axios.request(options);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching exercises" },
      { status: 500 }
    );
  }
}
