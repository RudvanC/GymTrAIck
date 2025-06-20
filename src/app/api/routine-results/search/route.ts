/**
 * @file api/search-routines/route.ts
 * @description
 * API endpoint to search for base routines by name.
 * Returns a list of up to 10 routines matching the search query.
 */

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

/**
 * GET /api/search-routines?q=<query>
 *
 * Searches base routines whose names contain the given query string (case-insensitive).
 *
 * @param req - Incoming GET request with search parameter `q`.
 * @returns JSON array of routines matching the query or an empty array if no query provided.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();

  // Return empty array if no query provided
  if (!q) return NextResponse.json([]);

  // Search for routines matching query
  const { data, error } = await supabaseAdmin
    .from("base_routines")
    .select("routine_id:id, name")
    .ilike("name", `%${q}%`)
    .order("name")
    .limit(10);

  if (error) {
    console.error("Error searching routines:", error);
    return NextResponse.json(
      { error: "Error searching routines" },
      { status: 500 }
    );
  }

  // Return matched routines (array of { id, name })
  return NextResponse.json(data);
}
