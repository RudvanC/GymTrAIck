import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { answer_id, routine_id } = await req.json();

  if (!answer_id || !routine_id) {
    return NextResponse.json(
      { error: "Faltan parámetros (answer_id, routine_id)" },
      { status: 400 }
    );
  }

  /* 1. Evitar duplicados */
  const { data: exists, error: existsErr } = await supabaseAdmin
    .from("user_routine_plan")
    .select("routine_id")
    .eq("answer_id", answer_id)
    .eq("routine_id", routine_id)
    .single();

  if (exists && !existsErr) {
    return NextResponse.json(
      { error: "La rutina ya está en el plan" },
      { status: 409 }
    );
  }

  /* 2. Obtener sort_order */
  const { data: last } = await supabaseAdmin
    .from("user_routine_plan")
    .select("sort_order")
    .eq("answer_id", answer_id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrder = (last?.sort_order ?? -1) + 1;

  /* 3. Insertar vínculo */
  const { error: insertErr } = await supabaseAdmin
    .from("user_routine_plan")
    .insert({
      answer_id,
      routine_id,
      sort_order: nextOrder,
    });

  if (insertErr) {
    console.error(insertErr);
    return NextResponse.json(
      { error: "No se pudo añadir la rutina" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
