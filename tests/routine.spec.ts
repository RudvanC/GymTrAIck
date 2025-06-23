// tests/routine.spec.ts

import { test, expect } from "@playwright/test";

// Datos de prueba para simular la respuesta de la API de ejercicios

const mockExerciseOptions = [
  { id: "101", name: "Push Up" },

  { id: "202", name: "Squat" },

  { id: "303", name: "Dumbbell Curl" }, // Usaremos este en el test
];

test.describe("Gestión de Rutinas", () => {
  test.beforeEach(async ({ page }) => {
    // --- ¡AÑADIMOS EL MOCK AQUÍ! ---

    // Interceptamos la llamada que hace el diálogo al montarse.

    // La URL es la que genera el cliente de Supabase para un .select() en la tabla 'exercises'.

    await page.route("**/rest/v1/exercises?select=id%2Cname", async (route) => {
      // Le damos una respuesta falsa, rápida y predecible.

      await route.fulfill({
        status: 200,

        contentType: "application/json",

        body: JSON.stringify(mockExerciseOptions),
      });
    });

    // El resto de tu login no cambia

    await page.goto("/auth/login");

    await page.getByPlaceholder("tu@email.com").fill("r35@gmail.com");

    await page.getByPlaceholder("Contraseña").fill("123456");

    await page.getByRole("button", { name: "Iniciar sesión" }).click();

    await expect(page).toHaveURL(/.*routine/);
  });

  test("debería permitir al usuario crear una rutina personalizada", async ({
    page,
  }) => {
    // 1. Acción: Abrir el diálogo de creación

    await page

      .getByRole("button", { name: "Crear Rutina Personalizada" })

      .click();

    // 2. ASERCIÓN CLAVE: Verificamos que el diálogo está visible

    const dialogTitle = page.getByRole("heading", {
      name: "Crea tu Rutina Personalizada",
    });

    await expect(dialogTitle).toBeVisible();

    // 3. Acción: Rellenamos el formulario

    const routineName = "Mi Rutina de Lunes";

    await page.getByPlaceholder("Ej: Día de Empuje").fill(routineName);

    await page

      .getByPlaceholder("Ej: Enfocado en pecho, hombros y tríceps")

      .fill("Test con Playwright y mocks.");

    // 4. Acción: Añadir un ejercicio

    await page.getByRole("button", { name: "Añadir Ejercicio" }).click();

    const exerciseSelector = page.getByRole("combobox").first();

    await expect(exerciseSelector).toBeVisible();

    await exerciseSelector.click();

    // Ahora podemos seleccionar un ejercicio de nuestra lista mockeada

    await page.getByText("Dumbbell Curl").click();

    // 5. Acción: Guardar la rutina

    await page.getByRole("button", { name: "Guardar Rutina" }).click();

    // 6. Verificación Final

    await expect(dialogTitle).toBeHidden();

    await expect(page.getByText(routineName)).toBeVisible();
  });
});
