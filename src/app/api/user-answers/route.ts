import { NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/**
 * GET handler for retrieving user answers from the database.
 *
 * @param request - The incoming HTTP GET request.
 * @returns A JSON response containing user answers or an error message.
 */
export async function GET(request: Request) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );

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
 */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SERVICE_ROLE_KEY! // clave de servicio (no pública)
);

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Inserta y pide solo la columna id
    const { data, error } = await supabase
      .from("user_answers")
      .insert([payload])
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
  } catch (err: unknown) {
    console.error("Error general en POST:", err);
    return NextResponse.json(
      {
        error: "Error en el servidor",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
