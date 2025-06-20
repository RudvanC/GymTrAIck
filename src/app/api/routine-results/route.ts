/**
 * @file api/routine-results/route.ts
 * @description
 * API handler to save the results of a completed workout routine by an authenticated user.
 * This route is called after the user finishes executing a routine.
 */

import { NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * POST /api/routine-results
 *
 * Saves a routine completion record including routine ID, completion date, and exercise results.
 * Requires user authentication.
 *
 * @param request - The incoming POST request with JSON body containing routineId, date, and results.
 * @returns A JSON response indicating success or failure.
 */
export async function POST(request: Request) {
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

  try {
    // Get the currently authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. You must be logged in to save a routine." },
        { status: 401 }
      );
    }

    // Parse and destructure request body
    const body = await request.json();
    const { routineId, date, results } = body;

    // Construct data object to insert into the database
    const dataToInsert = {
      user_id: user.id,
      routine_id: routineId,
      completed_at: date,
      results: results,
    };

    // Insert the routine result into the database
    const { data, error } = await supabase
      .from("user_routine_results")
      .insert(dataToInsert)
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Routine successfully saved.", data },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("Server error in save routine route:", err);

    return NextResponse.json(
      {
        error: "Internal server error",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
