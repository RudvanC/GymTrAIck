import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

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

export async function POST(request: Request) {
  try {
    console.log("=== POST REQUEST INICIADO ===");

    // Usar el mismo cliente para ambas funciones
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
