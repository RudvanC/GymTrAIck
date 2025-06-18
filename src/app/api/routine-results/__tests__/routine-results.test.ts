import { jest } from "@jest/globals";

/* ╔═════════════════════════════════╗
   ║ 1) Tipos y mocks de Supabase    ║
   ╚═════════════════════════════════╝ */

type User = { id: string };
type AuthResponse = { data: { user: User | null } };
type InsertResp = { data: unknown; error: { message: string } | null };
type GetUserFn = () => Promise<AuthResponse>;
type SingleFn = () => Promise<InsertResp>;

// — mockeamos cada pieza que usaremos — //
const mockGetUser = jest.fn<GetUserFn>();
const mockSingle = jest.fn<SingleFn>();
const mockInsert = jest.fn(() => ({ select: () => ({ single: mockSingle }) }));
const mockFrom = jest.fn(() => ({ insert: mockInsert }));

// createServerClient devuelve un “cliente” con las ramas necesarias
jest.mock("@supabase/ssr", () => ({
  createServerClient: () => ({
    auth: { getUser: mockGetUser },
    from: mockFrom,
  }),
}));

/* ╔═════════════════════════════════╗
   ║ 2) Mock de next/headers.cookies ║
   ╚═════════════════════════════════╝ */

const cookieStore = {
  get: jest.fn(),
  set: jest.fn(),
};
jest.mock("next/headers", () => ({
  cookies: jest.fn(() => cookieStore),
}));

/* ╔═════════════════════════════════╗
   ║ 3) Variables de entorno dummy   ║
   ╚═════════════════════════════════╝ */

process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon";

/* ╔═════════════════════════════════╗
   ║ 4) Import del endpoint          ║
   ╚═════════════════════════════════╝ */

import { POST } from "@/app/api/routine-results/route";

/* ╔═════════════════════════════════╗
   ║ 5) Helper para Request JSON     ║
   ╚═════════════════════════════════╝ */

const sampleBody = {
  routineId: 7,
  date: "2025-06-17T10:00:00Z",
  results: { pushUps: [12, 10, 9] },
};

const makeRequest = (body = sampleBody) =>
  new Request("http://localhost/api/save-routine", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

/* ╔═════════════════════════════════╗
   ║ 6) Test suite                   ║
   ╚═════════════════════════════════╝ */

describe("POST /api/save-routine", () => {
  afterEach(() => jest.clearAllMocks());

  it("devuelve 401 si no hay sesión", async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } });

    const res = await POST(makeRequest());
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json).toEqual({
      error: "No autorizado. Debes iniciar sesión para guardar una rutina.",
    });
    expect(mockGetUser).toHaveBeenCalledTimes(1);
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it("devuelve 500 si falla el insert", async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: { id: "u1" } } });
    mockSingle.mockResolvedValueOnce({
      data: null,
      error: { message: "DB fail" },
    });

    const res = await POST(makeRequest());
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({ error: "DB fail" });
    expect(mockInsert).toHaveBeenCalledWith({
      user_id: "u1",
      routine_id: sampleBody.routineId,
      completed_at: sampleBody.date,
      results: sampleBody.results,
    });
  });

  it("devuelve 201 + datos cuando todo va bien", async () => {
    const inserted = { id: 42, ...sampleBody, user_id: "u1" };

    mockGetUser.mockResolvedValueOnce({ data: { user: { id: "u1" } } });
    mockSingle.mockResolvedValueOnce({ data: inserted, error: null });

    const res = await POST(makeRequest());
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json).toEqual({
      message: "Rutina finalizada y guardada con éxito",
      data: inserted,
    });
    expect(mockSingle).toHaveBeenCalledTimes(1);
  });
});
