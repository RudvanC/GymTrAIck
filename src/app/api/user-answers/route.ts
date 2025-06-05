import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const supabase = createServerComponentClient({ cookies });

  // Por ejemplo, el cliente envía el user_id en query params:
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json(
      { error: "Falta user_id para identificar usuario" },
      { status: 400 }
    );
  }

  // Ya no chequeamos autenticación, solo buscamos respuestas para userId
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
