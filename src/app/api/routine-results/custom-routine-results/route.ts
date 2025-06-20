/**
 * @file api/routine-results/custom-routine-results/route.ts
 * @description
 * API route to save the completion results of a custom routine by an authenticated user.
 * Receives routine details and stores them in the database associated with the user.
 */

import { NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * POST /api/save-custom-routine-result
 *
 * Saves the completed routine results for the logged-in user.
 *
 * @param request - Incoming POST request with JSON body containing:
 *  - routineId: string, the ID of the routine
 *  - date: string, the completion date
 *  - results: object, details of each set performed
 *
 * @returns JSON response with success message and saved data or error message.
 */
export async function POST(request: Request) {
  const cookieStore = await cookies();

  // Create Supabase client that reads cookies from the request
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
    // Get the current authenticated user; user will be null if no session exists
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Deny access if no logged-in user found
    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized. You must be logged in to save a routine.",
        },
        { status: 401 }
      );
    }

    // Parse the JSON body sent from the front-end RoutineRunner component
    const body = await request.json();
    const { routineId, date, results } = body;

    // Prepare the object to insert into the database, linking it to the user
    const dataToInsert = {
      user_id: user.id, // Associates the result with the authenticated user
      routine_id: routineId,
      completed_at: date,
      results: results, // JSON object with details of each performed set
    };

    // Insert the routine completion data into the database
    // Ensure the table name matches your schema ('user_custom_routine_results' used as example)
    const { data, error } = await supabase
      .from("user_custom_routine_results")
      .insert(dataToInsert)
      .select()
      .single(); // Use .single() to get inserted row object instead of array

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Return success message and inserted data on successful save
    return NextResponse.json(
      { message: "Routine completed and saved successfully", data },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("API route error:", err);

    return NextResponse.json(
      {
        error: "Server error",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
