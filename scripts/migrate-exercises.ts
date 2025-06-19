/**
 * @module migrate-exercises
 * @description Este script se encarga de migrar datos de ejercicios desde la API de ExerciseDB a una tabla de Supabase.
 * Carga las variables de entorno, define las interfaces de los datos, configura los clientes de API y Supabase,
 * y maneja la obtención, transformación e inserción de los ejercicios en la base de datos por lotes.
 * También incluye un mecanismo para verificar y crear la tabla `exercises` en Supabase si no existe.
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

/**
 * Cargar variables de entorno desde el archivo `.env.local`.
 * Se espera que este archivo contenga las claves de API y las URLs necesarias.
 */
dotenv.config({ path: ".env.local" });

/**
 * @interface ExerciseDBExercise
 * @description Representa la estructura de un objeto de ejercicio tal como se recibe de la API de ExerciseDB.
 */
interface ExerciseDBExercise {
  id: string;
  name: string;
  bodyPart: string;
  equipment: string;
  gifUrl: string;
  target: string;
  secondaryMuscles?: string[];
  instructions?: string[];
}

/**
 * @interface SupabaseExercise
 * @description Representa la estructura de un objeto de ejercicio tal como se almacenará en la tabla `exercises` de Supabase.
 * Se mapean los nombres de las propiedades para coincidir con las convenciones de Supabase (snake_case).
 */
interface SupabaseExercise {
  id: string;
  name: string;
  body_part: string;
  equipment: string;
  gif_url: string;
  target: string;
  secondary_muscles: string[];
  instructions: string[];
}

// Configuración de APIs
/**
 * @constant {string | undefined} EXERCISEDB_API_KEY Clave API para acceder a ExerciseDB, obtenida de las variables de entorno.
 */
const EXERCISEDB_API_KEY = process.env.RAPIDAPI_KEY;
/**
 * @constant {string} EXERCISEDB_BASE_URL URL base de la API de ExerciseDB.
 */
const EXERCISEDB_BASE_URL = "https://exercisedb.p.rapidapi.com";
/**
 * @constant {string | undefined} SUPABASE_URL URL del proyecto Supabase, obtenida de las variables de entorno.
 */
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
/**
 * @constant {string | undefined} SUPABASE_SERVICE_KEY Clave de rol de servicio de Supabase (con permisos de administrador), obtenida de las variables de entorno.
 */
const SUPABASE_SERVICE_KEY = process.env.SERVICE_ROLE_KEY;

// Verificar variables de entorno al inicio
if (!EXERCISEDB_API_KEY) {
  console.error("❌ EXERCISEDB_API_KEY no está configurada en .env.local");
  console.log(
    "Necesitas obtener una API key de: https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb"
  );
  process.exit(1);
}

if (!SUPABASE_URL) {
  console.error(
    "❌ NEXT_PUBLIC_SUPABASE_URL no está configurada en .env.local"
  );
  process.exit(1);
}

if (!SUPABASE_SERVICE_KEY) {
  console.error(
    "❌ SUPABASE_SERVICE_ROLE_KEY no está configurada en .env.local"
  );
  console.log("Necesitas usar la Service Role Key, no la anon key");
  process.exit(1);
}

console.log("✅ Variables de entorno cargadas correctamente");

/**
 * @constant {SupabaseClient} supabase Cliente de Supabase inicializado con la URL y la clave de rol de servicio,
 * permitiendo operaciones con permisos de administrador.
 */
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

/**
 * @function fetchFromExerciseDB
 * @description Realiza una petición GET a la API de ExerciseDB.
 * Incluye cabeceras necesarias para la autenticación y parámetros de consulta para obtener todos los datos sin límite.
 * @param {string} endpoint El endpoint específico de la API de ExerciseDB a consultar (ej. "/exercises").
 * @returns {Promise<ExerciseDBExercise[]>} Una promesa que resuelve con un array de objetos `ExerciseDBExercise`.
 * @throws {Error} Si la respuesta de la API no es exitosa.
 */
async function fetchFromExerciseDB(
  endpoint: string
): Promise<ExerciseDBExercise[]> {
  const url = new URL(`${EXERCISEDB_BASE_URL}${endpoint}`);
  // Agrego los parámetros limit=0 y offset=0 para traer todo sin límite
  url.searchParams.append("limit", "0");
  url.searchParams.append("offset", "0");

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": EXERCISEDB_API_KEY!,
      "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Error fetching ${endpoint}: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

/**
 * @function getAllExercises
 * @description Obtiene todos los ejercicios disponibles de la API de ExerciseDB.
 * @returns {Promise<ExerciseDBExercise[]>} Una promesa que resuelve con un array de todos los objetos `ExerciseDBExercise`.
 * @throws {Error} Si ocurre un error durante la obtención de los ejercicios.
 */
async function getAllExercises(): Promise<ExerciseDBExercise[]> {
  try {
    console.log("🏋️  Obteniendo ejercicios de ExerciseDB...");

    // Obtener todos los ejercicios (con limit=0 y offset=0, trae todo)
    const exercises = await fetchFromExerciseDB("/exercises");

    console.log(`📊 Se encontraron ${exercises.length} ejercicios`);

    return exercises;
  } catch (error) {
    console.error("❌ Error obteniendo ejercicios:", error);
    throw error;
  }
}

/**
 * @function createExercisesTable
 * @description Verifica si la tabla `public.exercises` existe en Supabase y la crea si no.
 * En caso de que no pueda crearla automáticamente (por ejemplo, debido a permisos o configuración),
 * proporciona el SQL necesario para que el usuario lo ejecute manualmente y espera su confirmación.
 * @returns {Promise<void>} Una promesa que resuelve cuando la tabla ha sido verificada/creada.
 */
async function createExercisesTable(): Promise<void> {
  console.log("🔧 Verificando/creando tabla exercises...");

  // Primero intentamos crear la tabla
  const { error: createError } = await supabase.rpc("exec", {
    sql: `
      CREATE TABLE IF NOT EXISTS public.exercises (
        id VARCHAR PRIMARY KEY,
        name VARCHAR NOT NULL,
        body_part VARCHAR,
        equipment VARCHAR,
        gif_url VARCHAR,
        target VARCHAR,
        secondary_muscles TEXT[] DEFAULT '{}',
        instructions TEXT[] DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `,
  });

  if (createError) {
    console.log("⚠️  No se pudo crear la tabla automáticamente");
    console.log("📝 Por favor, ejecuta este SQL en tu dashboard de Supabase:");
    console.log(`CREATE TABLE IF NOT EXISTS public.exercises (
  id VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  body_part VARCHAR,
  equipment VARCHAR,
  gif_url VARCHAR,
  target VARCHAR,
  secondary_muscles TEXT[] DEFAULT '{}',
  instructions TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar las consultas
CREATE INDEX IF NOT EXISTS idx_exercises_body_part ON public.exercises(body_part);
CREATE INDEX IF NOT EXISTS idx_exercises_equipment ON public.exercises(equipment);
CREATE INDEX IF NOT EXISTS idx_exercises_target ON public.exercises(target);
    `);
    // Preguntar al usuario si quiere continuar
    console.log(
      "\n¿Has ejecutado el SQL anterior? Presiona Enter para continuar o Ctrl+C para salir..."
    );
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on("data", () => {
      process.stdin.setRawMode(false);
      process.stdin.pause();
    });
    await new Promise((resolve) => process.stdin.once("data", resolve));
  } else {
    console.log("✅ Tabla exercises verificada/creada correctamente");
  }
}

/**
 * @function transformExerciseData
 * @description Transforma un objeto de ejercicio de `ExerciseDBExercise` a `SupabaseExercise`.
 * Mapea los nombres de las propiedades y asegura que los arrays `secondaryMuscles` e `instructions`
 * sean arrays vacíos si son `undefined` en el origen.
 * @param {ExerciseDBExercise} exercise El objeto de ejercicio a transformar.
 * @returns {SupabaseExercise} El objeto de ejercicio transformado para Supabase.
 */
function transformExerciseData(exercise: ExerciseDBExercise): SupabaseExercise {
  return {
    id: exercise.id,
    name: exercise.name,
    body_part: exercise.bodyPart,
    equipment: exercise.equipment,
    gif_url: exercise.gifUrl,
    target: exercise.target,
    secondary_muscles: exercise.secondaryMuscles || [],
    instructions: exercise.instructions || [],
  };
}

/**
 * @function insertExercisesInBatches
 * @description Inserta un array de ejercicios en la tabla `exercises` de Supabase, procesándolos por lotes.
 * Utiliza `upsert` con `onConflict: "id"` para manejar posibles duplicados, actualizando los registros existentes si sus IDs coinciden.
 * Incluye un pequeño retardo entre lotes para evitar saturar la base de datos.
 * @param {ExerciseDBExercise[]} exercises Array de ejercicios a insertar.
 * @param {number} [batchSize=100] El número de ejercicios a insertar en cada lote. Por defecto es 100.
 * @returns {Promise<void>} Una promesa que resuelve cuando todos los lotes han sido procesados.
 */
async function insertExercisesInBatches(
  exercises: ExerciseDBExercise[],
  batchSize: number = 100
): Promise<void> {
  console.log(
    `📦 Insertando ${exercises.length} ejercicios en lotes de ${batchSize}...`
  );

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < exercises.length; i += batchSize) {
    const batch = exercises.slice(i, i + batchSize);
    const transformedBatch = batch.map(transformExerciseData);

    try {
      const { data, error } = await supabase
        .from("exercises")
        .upsert(transformedBatch, {
          onConflict: "id",
          ignoreDuplicates: false,
        });

      if (error) {
        console.error(
          `❌ Error insertando lote ${Math.floor(i / batchSize) + 1}:`,
          error.message
        );
        errorCount += batch.length;
        continue;
      }

      successCount += batch.length;
      console.log(
        `✅ Lote ${Math.floor(i / batchSize) + 1}/${Math.ceil(
          exercises.length / batchSize
        )} completado (${successCount}/${exercises.length})`
      );

      // Pequeña pausa para no saturar la base de datos
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.error(
        `❌ Error procesando lote ${Math.floor(i / batchSize) + 1}:`,
        error
      );
      errorCount += batch.length;
    }
  }

  console.log(`\n📊 Resumen de inserción:`);
  console.log(`✅ Exitosos: ${successCount}`);
  console.log(`❌ Errores: ${errorCount}`);
}

/**
 * @function migrateExercises
 * @description Función principal que orquesta el proceso de migración de ejercicios.
 * Realiza los siguientes pasos:
 * 1. Verifica la conexión a Supabase.
 * 2. Asegura que la tabla `exercises` exista en Supabase.
 * 3. Obtiene todos los ejercicios de ExerciseDB.
 * 4. Inserta los ejercicios obtenidos en Supabase por lotes.
 * 5. Verifica el número total de ejercicios en la base de datos después de la migración.
 * En caso de cualquier error crítico, el proceso se detiene y se sale con un código de error.
 * @returns {Promise<void>} Una promesa que resuelve cuando la migración ha finalizado.
 */
async function migrateExercises(): Promise<void> {
  try {
    console.log("🚀 Iniciando migración de ejercicios...");

    // Verificar conexión a Supabase
    const { data, error } = await supabase
      .from("exercises")
      .select("count", { count: "exact", head: true });
    if (error && !error.message.includes("does not exist")) {
      throw new Error(`Error conectando a Supabase: ${error.message}`);
    }

    // Crear tabla si no existe
    await createExercisesTable();

    // Obtener ejercicios de ExerciseDB
    const exercises = await getAllExercises();

    if (exercises.length === 0) {
      console.log("⚠️  No se encontraron ejercicios para migrar");
      return;
    }

    // Insertar en Supabase
    await insertExercisesInBatches(exercises);

    // Verificar la inserción
    const { count, error: countError } = await supabase
      .from("exercises")
      .select("*", { count: "exact", head: true });

    if (countError) {
      console.error("❌ Error verificando la inserción:", countError);
    } else {
      console.log(
        `🎉 Migración completada! Total de ejercicios en la base de datos: ${count}`
      );
    }
  } catch (error) {
    console.error("❌ Error en la migración:", error);
    process.exit(1);
  }
}

/**
 * Ejecuta la función principal `migrateExercises` si este script se ejecuta directamente.
 * Captura y registra cualquier error no manejado que ocurra durante la ejecución.
 */
migrateExercises().catch(console.error);
