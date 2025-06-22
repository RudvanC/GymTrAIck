import { jest } from "@jest/globals";
import { NextRequest } from "next/server";

/* ╔════════════════════════════════╗
   ║ 1)  Mock global de Supabase    ║
   ╚════════════════════════════════╝ */
/* Justo debajo de import { jest } … */

/* — Tipos auxiliares — */
type GetUserResp = Promise<{
  data: { user: { id: string } | null };
  error: null;
}>;
type RpcResp = Promise<{ data: unknown; error: { message: string } | null }>;
type DeleteResp = Promise<{ error: { message: string } | null }>;

/* — Mocks con genérico único — */
const getUserMock = jest.fn<() => GetUserResp>();
const rpcMock = jest.fn<() => RpcResp>();
const fromMock = jest.fn(); // lo seguimos redefiniendo por .mockImplementation

/* Supabase global */
const supabaseMock = {
  auth: { getUser: getUserMock },
  from: fromMock,
  rpc: rpcMock,
};

jest.mock("@supabase/ssr", () => ({
  createServerClient: () => supabaseMock,
}));

/* ╔════════════════════════════════╗
   ║ 2)  Mock de next/headers.cookies║
   ╚════════════════════════════════╝ */

const cookieStore = { getAll: jest.fn(() => []), set: jest.fn() };
jest.mock("next/headers", () => ({ cookies: jest.fn(() => cookieStore) }));

/* ╔════════════════════════════════╗
   ║ 3)  Env vars dummy             ║
   ╚════════════════════════════════╝ */

process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon";

/* ╔════════════════════════════════╗
   ║ 4)  Import de handlers         ║
   ╚════════════════════════════════╝ */

import { GET, POST, DELETE } from "@/app/api/custom-routines/route";

/* ╔════════════════════════════════╗
   ║ 5)  Helpers para Requests      ║
   ╚════════════════════════════════╝ */

// POST payloads
const validBody = {
  name: "My routine",
  description: "desc",
  exercises: [{ exercise_id: "1", sets: 3, reps: 10, position: 1 }],
};

const invalidBody = { name: "ab", exercises: [] }; // rompe Zod

const makePostReq = (body: unknown) =>
  new Request("http://localhost/api/custom-routines", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;

// DELETE helper
const makeDeleteReq = (routineId?: string) =>
  new Request(
    `http://localhost/api/custom-routines${
      routineId ? `?routine_id=${routineId}` : ""
    }`,
    { method: "DELETE" }
  ) as unknown as NextRequest;

/* ╔════════════════════════════════╗
   ║ 6)  Suite de tests             ║
   ╚════════════════════════════════╝ */

describe("API /custom-routines", () => {
  afterEach(() => jest.clearAllMocks());

  /* ──────── GET ──────── */

  it("GET → 401 cuando el usuario no está logueado", async () => {
    supabaseMock.auth.getUser.mockResolvedValueOnce({
      data: { user: null },
      error: null,
    });

    const res = await GET();
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json).toEqual({ error: "Unauthorized" });
    expect(supabaseMock.from).not.toHaveBeenCalled();
  });

  it("GET → 500 si falla la consulta", async () => {
    supabaseMock.auth.getUser.mockResolvedValueOnce({
      data: { user: { id: "u1" } },
      error: null,
    });

    // from('user_custom_routines')…
    supabaseMock.from.mockImplementationOnce(() => ({
      select: () => ({
        eq: () => ({
          order: () =>
            Promise.resolve({ data: null, error: { message: "DB err" } }),
        }),
      }),
    }));

    const res = await GET();
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({ error: "DB err" });
  });

  it("GET → 200 con payload transformado", async () => {
    supabaseMock.auth.getUser.mockResolvedValueOnce({
      data: { user: { id: "u1" } },
      error: null,
    });

    const dbRow = {
      id: 1,
      name: "Rut",
      description: "desc",
      user_custom_routine_exercises: [
        {
          exercise_id: "e2",
          sets: 2,
          reps: 8,
          position: 1,
          exercises: { name: "Squat", target: "legs" },
        },
        {
          exercise_id: "e1",
          sets: 3,
          reps: 10,
          position: 2,
          exercises: { name: "Push", target: "chest" },
        },
      ],
    };

    supabaseMock.from.mockImplementationOnce(() => ({
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({ data: [dbRow], error: null }),
        }),
      }),
    }));

    const res = await GET();
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual([
      {
        id: "1",
        name: "Rut",
        description: "desc",
        isCustom: true,
        exercises: [
          { id: "e2", name: "Squat", target: "legs", sets: 2, reps: 8 },
          { id: "e1", name: "Push", target: "chest", sets: 3, reps: 10 },
        ],
      },
    ]);
  });

  /* ──────── POST ──────── */

  it("POST → 401 si el usuario no está logueado", async () => {
    supabaseMock.auth.getUser.mockResolvedValueOnce({
      data: { user: null },
      error: null,
    });

    const res = await POST(makePostReq(validBody));
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json).toEqual({ error: "Unauthorized" });
    expect(supabaseMock.rpc).not.toHaveBeenCalled();
  });

  it("POST → 400 si el body no pasa validación", async () => {
    supabaseMock.auth.getUser.mockResolvedValueOnce({
      data: { user: { id: "u1" } },
      error: null,
    });

    const res = await POST(makePostReq(invalidBody));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json).toHaveProperty("errors");
    expect(supabaseMock.rpc).not.toHaveBeenCalled();
  });

  it("POST → 500 si la RPC falla", async () => {
    supabaseMock.auth.getUser.mockResolvedValueOnce({
      data: { user: { id: "u1" } },
      error: null,
    });
    supabaseMock.rpc.mockResolvedValueOnce({
      data: null,
      error: { message: "RPC fail" },
    });

    const res = await POST(makePostReq(validBody));
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({ error: "RPC fail" });
    expect(supabaseMock.rpc).toHaveBeenCalledWith(
      "create_user_custom_routine",
      expect.any(Object)
    );
  });

  it("POST → 201 con routineId cuando todo va bien", async () => {
    supabaseMock.auth.getUser.mockResolvedValueOnce({
      data: { user: { id: "u1" } },
      error: null,
    });
    supabaseMock.rpc.mockResolvedValueOnce({ data: "r123", error: null });

    const res = await POST(makePostReq(validBody));
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json).toEqual({ routineId: "r123" });
  });

  /* ──────── DELETE ──────── */

  it("DELETE → 400 si falta routine_id", async () => {
    const res = await DELETE(makeDeleteReq());
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json).toEqual({ error: "Missing 'routine_id' query parameter" });
  });

  it("DELETE → 401 si el usuario no está logueado", async () => {
    supabaseMock.auth.getUser.mockResolvedValueOnce({
      data: { user: null },
      error: null,
    });

    const res = await DELETE(makeDeleteReq("r1"));
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json).toEqual({ error: "Unauthorized" });
    expect(supabaseMock.from).not.toHaveBeenCalled();
  });

  it("DELETE → 500 si Supabase devuelve error", async () => {
    supabaseMock.auth.getUser.mockResolvedValueOnce({
      data: { user: { id: "u1" } },
      error: null,
    });

    supabaseMock.from.mockImplementationOnce(() => ({
      delete: () => ({
        eq: () => Promise.resolve({ error: { message: "del fail" } }),
      }),
    }));

    const res = await DELETE(makeDeleteReq("r1"));
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({ error: "del fail" });
  });

  it("DELETE → 204 cuando elimina con éxito", async () => {
    supabaseMock.auth.getUser.mockResolvedValueOnce({
      data: { user: { id: "u1" } },
      error: null,
    });

    supabaseMock.from.mockImplementationOnce(() => ({
      delete: () => ({
        eq: () => Promise.resolve({ error: null }),
      }),
    }));

    const res = await DELETE(makeDeleteReq("r1"));

    expect(res.status).toBe(204);
    expect(await res.text()).toBe(""); // cuerpo vacío
  });
});
