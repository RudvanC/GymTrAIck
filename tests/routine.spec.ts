// tests/routine.spec.ts
import { test, expect } from "@playwright/test";
import crypto from "node:crypto";

const mockExerciseOptions = [
  { id: "101", name: "Push Up" },
  { id: "202", name: "Squat" },
  { id: "303", name: "Dumbbell Curl" },
];

/** Guarda los nombres creados en esta suite */
const createdRoutineNames: string[] = [];

test.describe("Gestión de Rutinas", () => {
  //--------------------------------------------------------
  // MOCKS + LOGIN
  //--------------------------------------------------------
  test.beforeEach(async ({ page }) => {
    // Mock al GET /exercises
    await page.route("**/rest/v1/exercises?select=id%2Cname", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockExerciseOptions),
      });
    });

    // Login
    await page.goto("/auth/login");
    await page.getByPlaceholder("tu@email.com").fill("r35@gmail.com");
    await page.getByPlaceholder("Contraseña").fill("123456");
    await page.getByRole("button", { name: "Iniciar sesión" }).click();
    await expect(page).toHaveURL(/.*routine/);
  });

  //--------------------------------------------------------
  // TEST PRINCIPAL
  //--------------------------------------------------------
  test("crea y guarda una rutina personalizada", async ({ page }) => {
    // Nombre aleatorio
    const routineName = `Rutina-${crypto.randomUUID().slice(0, 6)}`; // p.ej. Rutina-a1b2c3
    createdRoutineNames.push(routineName);

    // Abrir diálogo
    await page
      .getByRole("button", { name: "Crear Rutina Personalizada" })
      .click();
    await expect(
      page.getByRole("heading", { name: "Crea tu Rutina Personalizada" })
    ).toBeVisible();

    // Rellenar campos
    await page.getByPlaceholder("Ej: Día de Empuje").fill(routineName);
    await page
      .getByPlaceholder("Ej: Enfocado en pecho, hombros y tríceps")
      .fill("Test con Playwright y mocks.");

    // Añadir ejercicio
    await page.getByRole("button", { name: "Añadir Ejercicio" }).click();
    await page.getByRole("combobox").first().click();
    await page.getByText("Dumbbell Curl").click();

    // Guardar
    await page.getByRole("button", { name: "Guardar Rutina" }).click();

    // Verifica que se cerró el diálogo y aparece la tarjeta
    await expect(
      page.getByRole("heading", { name: "Crea tu Rutina Personalizada" })
    ).toBeHidden();
    await expect(page.getByText(routineName)).toBeVisible();
  });

  //--------------------------------------------------------
  // LIMPIEZA GLOBAL
  //--------------------------------------------------------
  test.afterAll(async ({ request }) => {
    if (!createdRoutineNames.length) return;

    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/base_routines`;

    for (const name of createdRoutineNames) {
      // Nota: Se asume que la columna se llama 'name'
      await request.delete(`${url}?name=eq.${encodeURIComponent(name)}`, {
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
        },
      });
    }
  });
});
