// scripts/migrate-exercises.ts
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config({ path: ".env.local" });

// Tipos
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
const EXERCISEDB_API_KEY = process.env.RAPIDAPI_KEY;
const EXERCISEDB_BASE_URL = "https://exercisedb.p.rapidapi.com";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
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

// Cliente de Supabase con permisos de administrador
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Función para hacer peticiones a ExerciseDB con límite y offset en query params
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

// ... resto del código sin cambios ...

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

// Función para crear la tabla en Supabase si no existe
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
    console.log(`
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

// Función para transformar los datos de ExerciseDB al formato de Supabase
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

// Función para insertar ejercicios en Supabase por lotes
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

// Función principal
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

// Ejecutar si se llama directamente
migrateExercises().catch(console.error);
