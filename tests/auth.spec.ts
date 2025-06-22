// tests/auth.spec.ts
import { test, expect } from "@playwright/test";

// Describimos el conjunto de tests para la autenticación
test.describe("Autenticación de Usuario", () => {
  // Test: Un usuario debería poder iniciar sesión y ser redirigido al dashboard
  test("debería permitir a un usuario iniciar sesión y redirigir al dashboard", async ({
    page,
  }) => {
    // 1. Navegación: Vamos a la página de login
    await page.goto("/auth/login"); // O la URL de tu página de login

    // 2. Acción: Rellenamos el formulario de login.
    // Usamos localizadores robustos que buscan por el texto del placeholder.
    await page.getByPlaceholder("tu@email.com").fill("r2@gmail.com");
    await page.getByPlaceholder("Contraseña").fill("123456");

    // 3. Acción: Hacemos clic en el botón de "Iniciar sesión".
    // Buscamos el botón por su rol y su nombre visible. Es la forma más recomendada.
    await page.getByRole("button", { name: "Iniciar sesión" }).click();

    // 4. Verificación (Assertion): Esperamos a que la URL cambie al dashboard.
    // Playwright esperará automáticamente un tiempo hasta que esto se cumpla.
    await expect(page).toHaveURL("/progress");

    // 5. Verificación extra: Comprobamos que un elemento clave del dashboard es visible.
    // Por ejemplo, el título que creamos antes. Esto confirma que la página ha cargado.
    await expect(
      page.getByRole("heading", { name: "Tu Progreso" })
    ).toBeVisible();
  });

  // Aquí podrías añadir más tests, como:
  // - test('debería mostrar un error con credenciales incorrectas', ...)
  // - test('debería permitir a un usuario registrarse', ...)
});
