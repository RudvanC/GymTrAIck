import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();

  if (!q) return NextResponse.json([]);

  const { data, error } = await supabaseAdmin
    .from("base_routines")
    .select("routine_id:id, name")
    .ilike("name", `%${q}%`)
    .order("name")
    .limit(10);

  if (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error buscando rutinas" },
      { status: 500 }
    );
  }

  return NextResponse.json(data); // [{ id, name }]
}
