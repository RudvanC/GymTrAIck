import { jest } from "@jest/globals";

/* ╔════════════════════════════════╗
   ║ 1) Tipos & mocks – Supabase    ║
   ╚════════════════════════════════╝ */

type SelectResp = { data: unknown; error: { message: string } | null };
type GetResp = SelectResp; // mismo shape
type InsertResp = SelectResp;

type OrderFn = () => Promise<GetResp>;
type EqFn = () => { order: OrderFn };
type SelectFn = () => { eq: EqFn };
type FromFn = () => { select: SelectFn };

/* Mocks para el flujo GET */
const mockOrder = jest.fn<OrderFn>();
const mockEq = jest.fn<EqFn>(() => ({ order: mockOrder }));
const mockSelect = jest.fn<SelectFn>(() => ({ eq: mockEq }));
const mockFrom = jest.fn<FromFn>(() => ({ select: mockSelect }));

/* Mocks para el flujo POST */
const mockSelectPost = jest.fn<() => Promise<InsertResp>>();
const mockInsert = jest.fn(() => ({ select: mockSelectPost }));
const mockFromPost = jest.fn(() => ({ insert: mockInsert }));

/* createServerClient y createClient */
jest.mock("@supabase/ssr", () => ({
  createServerClient: () => ({
    from: mockFrom,
  }),
}));

jest.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: mockFromPost,
  }),
}));

/* ╔════════════════════════════════╗
   ║ 2) Mock de cookies (Next.js)   ║
   ╚════════════════════════════════╝ */

const cookieStore = { get: jest.fn(), set: jest.fn() };
jest.mock("next/headers", () => ({ cookies: jest.fn(() => cookieStore) }));

/* ╔════════════════════════════════╗
   ║ 3) Env vars dummy              ║
   ╚════════════════════════════════╝ */

process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon";
process.env.SERVICE_ROLE_KEY = "service";

/* ╔════════════════════════════════╗
   ║ 4) Import de la ruta           ║
   ╚════════════════════════════════╝ */

import { GET, POST } from "@/app/api/user-answers/route";

/* ╔════════════════════════════════╗
   ║ 5) Helpers para Requests       ║
   ╚════════════════════════════════╝ */

const makeGetReq = (uid?: string) =>
  new Request(
    `http://localhost/api/user-answers${uid ? `?user_id=${uid}` : ""}`,
    { method: "GET" }
  );

const samplePayload = {
  user_id: "u1",
  answer: "42",
  created_at: "2025-06-17T10:00:00Z",
};

const makePostReq = (payload = samplePayload) =>
  new Request("http://localhost/api/user-answers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

/* ╔════════════════════════════════╗
   ║ 6) Suite de tests              ║
   ╚════════════════════════════════╝ */

describe("API /user-answers", () => {
  afterEach(() => jest.clearAllMocks());

  /* ========== GET ========== */

  it("GET → 400 si falta user_id", async () => {
    const res = await GET(makeGetReq());
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json).toEqual({ error: "Falta user_id para identificar usuario" });
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it("GET → 500 si Supabase falla", async () => {
    mockOrder.mockResolvedValueOnce({
      data: null,
      error: { message: "DB fail" },
    });

    const res = await GET(makeGetReq("u1"));
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({ error: "Error al obtener respuestas" });
    expect(mockEq).toHaveBeenCalledWith("user_id", "u1");
  });

  it("GET → 200 con datos correctamente ordenados", async () => {
    const rows = [{ id: 1, user_id: "u1", answer: "42" }];
    mockOrder.mockResolvedValueOnce({ data: rows, error: null });

    const res = await GET(makeGetReq("u1"));
    const json = await res.json();

    expect(res.status).toBe(200); // default de NextResponse.json
    expect(json).toEqual(rows);
    expect(mockOrder).toHaveBeenCalledTimes(1);
  });

  /* ========== POST ========== */

  it("POST → 500 si insert falla", async () => {
    mockSelectPost.mockResolvedValueOnce({
      data: null,
      error: { message: "Insert fail" },
    });

    const res = await POST(makePostReq());
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({ error: "Error de base de datos: Insert fail" });
    expect(mockInsert).toHaveBeenCalledWith([samplePayload]);
  });

  it("POST → 201 si inserta con éxito", async () => {
    const returned = [{ id: 10, ...samplePayload }];
    mockSelectPost.mockResolvedValueOnce({ data: returned, error: null });

    const res = await POST(makePostReq());
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json).toEqual({ data: returned });
    expect(mockSelectPost).toHaveBeenCalledTimes(1);
  });
});
