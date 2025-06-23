/**
 * @file api/user-answers/route.ts
 * @description
 * API routes to manage user answers with GET, POST and PATCH methods.
 * Handles authentication and user ownership verification.
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
/**
 * GET /api/user-answers
 *
 * Retrieves all answers submitted by the authenticated user, ordered by creation date descending.
 *
 * @param request - Incoming GET request.
 * @returns JSON array of user answers or an error if unauthorized or on failure.
 */
export async function GET(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("user_answers")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user answers:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/**
 * POST /api/user-answers
 *
 * Inserts a new answer for the authenticated user.
 *
 * @param request - Incoming POST request with JSON body containing answer data.
 * @returns JSON of inserted answer or error if unauthorized or on failure.
 */
export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const securePayload = { ...payload, user_id: user.id };

    const { data, error } = await supabase
      .from("user_answers")
      .insert(securePayload)
      .select()
      .single();

    if (error) {
      console.error("Supabase POST error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err: unknown) {
    console.error("General POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/**
 * PATCH /api/user-answers?id=<answerId>
 *
 * Updates an existing answer for the authenticated user.
 *
 * @param request - Incoming PATCH request with query parameter `id` and JSON body of updated fields.
 * @returns JSON of updated answer or error if unauthorized, not found, or on failure.
 */
export async function PATCH(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const answerId = searchParams.get("id");

  if (!answerId) {
    return NextResponse.json(
      { error: "Missing answer ID to update" },
      { status: 400 }
    );
  }

  try {
    const payload = await request.json();

    const { data, error } = await supabase
      .from("user_answers")
      .update(payload)
      .eq("id", answerId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Supabase PATCH error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json(
        { error: "Answer not found or no permission to edit" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    console.error("General PATCH error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
