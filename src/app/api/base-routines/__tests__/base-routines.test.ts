import { jest } from "@jest/globals";
import { NextResponse } from "next/server";

// 1) Mock de Supabase ---------------------------
const supabaseMock = {
  from: jest.fn(),
};

jest.mock("@supabase/supabase-js", () => ({
  createClient: () => supabaseMock,
}));

// 2) Env vars dummy ------------------------------
process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost";
process.env.SERVICE_ROLE_KEY = "service";

// 3) Import del handler --------------------------
import { GET } from "@/app/api/base-routines/route";

// 4) Suite de tests ------------------------------
describe("GET /api/base-routines", () => {
  afterEach(() => jest.clearAllMocks());

  it("devuelve 500 si Supabase falla", async () => {
    supabaseMock.from.mockImplementationOnce(() => ({
      select: () => ({
        order: () =>
          Promise.resolve({ data: null, error: { message: "DB fail" } }),
      }),
    }));

    const res = await GET();
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json).toEqual({ error: "DB fail" });
  });

  it("devuelve 200 con rutinas transformadas", async () => {
    // Datos simulados desde DB
    const dbData: any[] = [
      {
        id: "1",
        slug: "slug1",
        name: "Routine1",
        description: "desc1",
        base_routine_exercises: [
          {
            sort_order: 1,
            sets: 3,
            reps: 10,
            exercises: {
              id: 100,
              name: "Push Up",
              gif_url: "url",
              equipment: "body",
              target: "chest",
              secondary_muscles: "triceps",
            },
          },
          {
            sort_order: 0,
            sets: 2,
            reps: 8,
            exercises: {
              id: 200,
              name: "Squat",
              gif_url: "url2",
              equipment: "body",
              target: "legs",
              secondary_muscles: "glutes",
            },
          },
        ],
      },
    ];

    supabaseMock.from.mockImplementationOnce(() => ({
      select: () => ({
        order: () => Promise.resolve({ data: dbData, error: null }),
      }),
    }));

    const res = await GET();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual([
      {
        id: "1",
        slug: "slug1",
        name: "Routine1",
        description: "desc1",
        exercises: [
          {
            id: 200,
            name: "Squat",
            gif_url: "url2",
            equipment: "body",
            target: "legs",
            secondary_muscles: "glutes",
            sets: 2,
            reps: 8,
            sort_order: 0,
          },
          {
            id: 100,
            name: "Push Up",
            gif_url: "url",
            equipment: "body",
            target: "chest",
            secondary_muscles: "triceps",
            sets: 3,
            reps: 10,
            sort_order: 1,
          },
        ],
      },
    ]);
  });
});
