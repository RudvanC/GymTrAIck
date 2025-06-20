/**
 * @file api/regenerate-plan/route.ts
 * @description
 * API handler that deletes an existing routine recommendation plan for a given answer ID.
 * Used when the user wants to regenerate their routine recommendations from scratch.
 */

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client configured with service role key.
 * Only used server-side for full access to database operations.
 */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SERVICE_ROLE_KEY!
);

/**
 * POST /api/regenerate-plan?answer_id=<id>
 *
 * Deletes all routine entries related to the specified answer ID.
 * Typically used before re-running the routine recommendation RPC.
 *
 * @param req - Incoming POST request with `answer_id` query parameter.
 * @returns JSON response indicating success or error.
 */
export async function POST(req: Request) {
  const answerId = new URL(req.url).searchParams.get("answer_id");

  if (!answerId) {
    return NextResponse.json(
      { error: "answer_id is required" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("user_routine_plan")
    .delete()
    .eq("answer_id", answerId);

  if (error) {
    console.error("[regenerate-plan] Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
