// src/app/api/regenerate-plan/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SERVICE_ROLE_KEY! // asegúrate del nombre
);

export async function POST(req: Request) {
  const answerId = new URL(req.url).searchParams.get("answer_id");
  console.log("[regen] answerId =", answerId);

  if (!answerId)
    return NextResponse.json({ error: "answer_id required" }, { status: 400 });

  const { error } = await supabase
    .from("user_routine_plan")
    .delete()
    .eq("answer_id", answerId);

  if (error) {
    console.error("[regen] supabase error →", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
