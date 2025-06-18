import { jest } from "@jest/globals";

/* ╔════════════════════════════════╗
   ║ 1) Supabase – objeto único     ║
   ╚════════════════════════════════╝ */

// Creamos un mock “global” de Supabase del que cambiaremos implementaciones
const supabaseMock = {
  from: jest.fn(), // se configurará por llamada
  rpc: jest.fn(), // sólo lo usaremos en el test “genera plan”
};

jest.mock("@supabase/supabase-js", () => ({
  createClient: () => supabaseMock,
}));

/* ╔════════════════════════════════╗
   ║ 2) Env vars ficticias          ║
   ╚════════════════════════════════╝ */

process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost";
process.env.SERVICE_ROLE_KEY = "service";

/* ╔════════════════════════════════╗
   ║ 3) Import del endpoint         ║
   ╚════════════════════════════════╝ */

import { GET, DELETE } from "@/app/api/recommend-routines-by-answer/route";

/* ╔════════════════════════════════╗
   ║ 4) Helpers de Request          ║
   ╚════════════════════════════════╝ */

const makeGetReq = (answerId?: string) =>
  new Request(
    `http://localhost/api/recommended-routines${
      answerId ? `?answer_id=${answerId}` : ""
    }`,
    { method: "GET" }
  );

const makeDeleteReq = (answerId?: string, routineId?: string) =>
  new Request(
    `http://localhost/api/recommended-routines?${new URLSearchParams({
      ...(answerId && { answer_id: answerId }),
      ...(routineId && { routine_id: routineId }),
    })}`,
    { method: "DELETE" }
  );

/* ╔════════════════════════════════╗
   ║ 5) Suite de tests              ║
   ╚════════════════════════════════╝ */

describe("API /recommended-routines", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  /* ========== GET ========== */

  it("GET → 400 si falta answer_id", async () => {
    const res = await GET(makeGetReq());
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json).toEqual({ error: "Missing query param: answer_id" });
    expect(supabaseMock.from).not.toHaveBeenCalled();
  });

  it("GET → 500 si falla la primera query (persistErr)", async () => {
    // 1ª llamada: .from('user_routine_plan') …
    supabaseMock.from.mockImplementationOnce(() => ({
      select: () => ({
        eq: () => ({
          order: () =>
            Promise.resolve<{ data: null; error: { message: string } }>({
              data: null,
              error: { message: "DB fail" },
            }),
        }),
      }),
    }));

    const res = await GET(makeGetReq("a1"));
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({ error: "DB fail" });
  });

  it("GET → 200 utilizando plan ya persistido", async () => {
    /* —— 1ª llamada: user_routine_plan —— */
    const persistedRows = [{ routine_id: "r1", sort_order: 0 }];
    supabaseMock.from.mockImplementationOnce(() => ({
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({ data: persistedRows, error: null }),
        }),
      }),
    }));

    /* —— 2ª llamada: base_routines —— */
    const routineRow = {
      id: "r1",
      slug: "routine-1",
      name: "Routine 1",
      description: "Desc",
      base_routine_exercises: [
        {
          sort_order: 0,
          sets: 3,
          reps: 10,
          exercises: {
            id: 1,
            name: "Push up",
            gif_url: "gif",
            equipment: "body",
            target: "chest",
            secondary_muscles: "triceps",
          },
        },
      ],
    };

    supabaseMock.from.mockImplementationOnce(() => ({
      select: () => ({
        in: () => Promise.resolve({ data: [routineRow], error: null }),
      }),
    }));

    const res = await GET(makeGetReq("a1"));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual([
      {
        id: "r1",
        slug: "routine-1",
        name: "Routine 1",
        description: "Desc",
        exercises: [
          {
            id: 1,
            name: "Push up",
            gif_url: "gif",
            equipment: "body",
            target: "chest",
            secondary_muscles: "triceps",
            sets: 3,
            reps: 10,
            sort_order: 0,
          },
        ],
      },
    ]);

    // Asegura que se consultó la tabla correcta en orden:
    expect(supabaseMock.from).toHaveBeenNthCalledWith(1, "user_routine_plan");
    expect(supabaseMock.from).toHaveBeenNthCalledWith(2, "base_routines");
  });

  /* ========== DELETE ========== */

  it("DELETE → 400 si faltan parámetros", async () => {
    const res = await DELETE(makeDeleteReq()); // sin params
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json).toEqual({ error: "Parámetros faltantes" });
    expect(supabaseMock.from).not.toHaveBeenCalled();
  });

  it("DELETE → 500 si Supabase lanza excepción", async () => {
    // delete().eq().eq() terminará lanzando
    supabaseMock.from.mockImplementationOnce(() => ({
      delete: () => ({
        eq: () => ({
          eq: () => {
            throw new Error("boom");
          },
        }),
      }),
    }));

    const res = await DELETE(makeDeleteReq("a1", "r1"));
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({ error: "Error eliminando la rutina" });
  });

  it("DELETE → 200 cuando elimina con éxito", async () => {
    supabaseMock.from.mockImplementationOnce(() => ({
      delete: () => ({
        eq: () => ({
          eq: () => Promise.resolve({}),
        }),
      }),
    }));

    const res = await DELETE(makeDeleteReq("a1", "r1"));
    const json = await res.json();

    expect(res.status).toBe(200); // valor por defecto de NextResponse.json
    expect(json).toEqual({ ok: true });
    expect(supabaseMock.from).toHaveBeenCalledWith("user_routine_plan");
  });
});
