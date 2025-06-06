import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

/**
 * GET handler for retrieving user answers from the database.
 *
 * @param request - The incoming HTTP GET request.
 * @returns A JSON response containing user answers or an error message.
 *
 * @remarks
 * - Requires `user_id` as a query parameter.
 * - Returns 400 if `user_id` is missing.
 * - Returns 500 if Supabase fails to fetch data.
 *
 * @example
 * // Request:
 * GET /api/user-answers?user_id=123
 *
 * // Response:
 * 200 OK
 * [ { user_id: '123', goal: 'Lose weight', ... } ]
 */
export async function GET(request: Request) {
  const supabase = createServerComponentClient({ cookies });

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json(
      { error: "Falta user_id para identificar usuario" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("user_answers")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.log("Error al obtener respuestas:", error);
    return NextResponse.json(
      { error: "Error al obtener respuestas" },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}

/**
 * POST handler for inserting user answers into the database.
 *
 * @param request - The incoming HTTP POST request containing user answers in JSON format.
 * @returns A JSON response indicating success or failure.
 *
 * @remarks
 * - Validates required fields: `user_id`, `training_experience`, `availability`, `goal`, `fitness_level`, and `session_duration`.
 * - Returns 400 for missing fields or invalid JSON.
 * - Returns 500 if Supabase returns an error or there's a server issue.
 *
 * @example
 * // Request body:
 * {
 *   "user_id": "123",
 *   "training_experience": "Intermediate",
 *   "availability": "Weekdays",
 *   "goal": "Build muscle",
 *   "fitness_level": "Medium",
 *   "session_duration": "45"
 * }
 *
 * // Response:
 * 201 Created
 * { data: [...] }
 */
export async function POST(request: Request) {
  try {
    console.log("=== POST REQUEST INICIADO ===");

    const supabase = createServerComponentClient({ cookies });

    let answers;
    try {
      answers = await request.json();
      console.log("Datos recibidos:", answers);
    } catch (parseError) {
      console.error("Error al parsear JSON:", parseError);
      return NextResponse.json(
        { error: "JSON inválido en el request" },
        { status: 400 }
      );
    }

    const requiredFields = [
      "user_id",
      "training_experience",
      "availability",
      "goal",
      "fitness_level",
      "session_duration",
    ];
    const missingFields = requiredFields.filter((field) => !answers[field]);

    if (missingFields.length > 0) {
      console.log("Campos faltantes:", missingFields);
      return NextResponse.json(
        { error: `Campos requeridos faltantes: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    console.log("Insertando en Supabase...");
    const { data, error } = await supabase
      .from("user_answers")
      .insert([answers])
      .select();

    if (error) {
      console.error("Error de Supabase:", error);
      return NextResponse.json(
        { error: `Error de base de datos: ${error.message}` },
        { status: 500 }
      );
    }

    console.log("Datos insertados exitosamente:", data);
    return NextResponse.json({ data }, { status: 201 });
  } catch (err: any) {
    console.error("Error general en POST:", err);
    return NextResponse.json(
      { error: `Error del servidor: ${err.message}` },
      { status: 500 }
    );
  }
}
