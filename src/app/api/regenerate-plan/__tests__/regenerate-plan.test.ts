import { jest } from "@jest/globals";

/* ========= 1) Mock de Supabase ========= */
type SupabaseResponse = { error: { message: string | null } | null };
type EqFn = (column: string, value: string) => Promise<SupabaseResponse>;

const mockEq = jest.fn<EqFn>(); // se sobrescribe en cada test
const mockFrom = jest.fn(() => ({
  delete: () => ({ eq: mockEq }), // mimetiza .delete().eq()
}));

// El mock debe declararse *antes* de importar el código a probar
jest.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: mockFrom,
  }),
}));

/* ========= 2) Import del endpoint ========= */

import { POST } from "@/app/api/regenerate-plan/route";

/* ========= 3) Fábrica de Request ========= */

const makeRequest = (answer?: string) =>
  new Request(
    `http://localhost/api/regenerate-plan${
      answer ? `?answer_id=${answer}` : ""
    }`,
    { method: "POST" }
  );

/* ========= 4) Tests ========= */

describe("POST /api/regenerate-plan", () => {
  afterEach(() => {
    jest.clearAllMocks(); // limpia entre casos
  });

  afterAll(() => {
    jest.restoreAllMocks(); // restaura los mocks
  });

  it("devuelve 400 si falta answer_id", async () => {
    const res = await POST(makeRequest());
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body).toEqual({ error: "answer_id is required" });
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it("devuelve 500 si Supabase falla", async () => {
    mockEq.mockResolvedValueOnce({ error: { message: "DB fail" } });

    const res = await POST(makeRequest("123"));
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body).toEqual({ error: "DB fail" });
    expect(mockEq).toHaveBeenCalledWith("answer_id", "123");
  });

  it("devuelve 200 + ok:true cuando todo va bien", async () => {
    mockEq.mockResolvedValueOnce({ error: null });

    const res = await POST(makeRequest("123"));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual({ ok: true });
    expect(mockEq).toHaveBeenCalledWith("answer_id", "123");
  });
});
