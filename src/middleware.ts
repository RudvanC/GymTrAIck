import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // 1. Obtenemos la sesión del usuario
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2. Definimos las rutas protegidas
  const protectedRoutes = ["/dashboard", "/profile", "/routine"]; // Añade aquí todas las rutas que quieras proteger

  // 3. Lógica de redirección
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Si el usuario no está logueado y intenta acceder a una ruta protegida
  if (!user && protectedRoutes.some((route) => pathname.startsWith(route))) {
    // Redirigimos a la página de login
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Opcional: Si el usuario está logueado y intenta acceder a /login o /register
  if (user && (pathname === "/auth/login" || pathname === "/auth/register")) {
    // Redirigimos al dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Si no se cumple ninguna condición, dejamos que la petición continúe
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
