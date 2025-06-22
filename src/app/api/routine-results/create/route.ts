/**
 * @file api/add-routine-to-plan/route.ts
 * @description
 * API handler to add a specific routine to a user's recommendation plan based on their answer.
 * Prevents duplicate entries and automatically calculates the next sort order.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/add-routine-to-plan
 *
 * Adds a routine to a recommendation plan if it does not already exist.
 * Automatically assigns the correct `sort_order` based on existing entries.
 *
 * @param req - The incoming POST request with JSON body containing `answer_id` and `routine_id`.
 * @returns JSON response indicating success or error.
 */
export async function POST(req: NextRequest) {
  const { answer_id, routine_id } = await req.json();

  const supabase = await createClient();

  if (!answer_id || !routine_id) {
    return NextResponse.json(
      { error: "Missing parameters: answer_id and routine_id are required." },
      { status: 400 }
    );
  }

  // Step 1: Prevent duplicate routine entries for the same answer
  const { data: exists, error: existsErr } = await supabase
    .from("user_routine_plan")
    .select("routine_id")
    .eq("answer_id", answer_id)
    .eq("routine_id", routine_id)
    .single();

  if (exists && !existsErr) {
    return NextResponse.json(
      { error: "This routine is already part of the plan." },
      { status: 409 }
    );
  }

  // Step 2: Determine the next sort_order for this answer_id
  const { data: last } = await supabase
    .from("user_routine_plan")
    .select("sort_order")
    .eq("answer_id", answer_id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrder = (last?.sort_order ?? -1) + 1;

  // Step 3: Insert the new routine entry into the plan
  const { error: insertErr } = await supabase
    .from("user_routine_plan")
    .insert({
      answer_id,
      routine_id,
      sort_order: nextOrder,
    });

  if (insertErr) {
    console.error("Failed to insert routine into plan:", insertErr);
    return NextResponse.json(
      { error: "Failed to add routine to the plan." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
