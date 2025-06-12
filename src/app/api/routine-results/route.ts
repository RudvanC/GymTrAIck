import { NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = await cookies();

  // 1. Creamos un cliente de Supabase que puede leer las cookies de la petición
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {  
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );

  try {
    // 2. Obtenemos la sesión del usuario. Si no hay sesión, 'user' será null.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 3. ¡Paso clave! Si no hay un usuario logueado, denegamos el acceso.
    if (!user) {
      return NextResponse.json(
        {
          error: "No autorizado. Debes iniciar sesión para guardar una rutina.",
        },
        { status: 401 }
      );
    }

    // 4. Leemos los datos enviados desde el componente RoutineRunner
    const body = await request.json();
    const { routineId, date, results } = body;

    // 5. Preparamos el objeto que se va a insertar en la base de datos,
    //    añadiendo el ID del usuario que obtuvimos de la sesión.
    const dataToInsert = {
      user_id: user.id, // ¡Aquí asociamos el resultado con el usuario!
      routine_id: routineId,
      completed_at: date,
      results: results, // El objeto JSON con los detalles de cada serie
    };

    // 6. Insertamos los datos en la tabla.
    //    Asegúrate de que el nombre de tu tabla sea correcto ('user_routine_results' es un ejemplo).
    const { data, error } = await supabase
      .from("user_routine_results")
      .insert(dataToInsert)
      .select()
      .single(); // .single() para obtener el objeto insertado en lugar de un array

    if (error) {
      // Si hay un error en la base de datos, lo devolvemos
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 7. Si todo sale bien, devolvemos un mensaje de éxito con los datos guardados.
    return NextResponse.json(
      { message: "Rutina finalizada y guardada con éxito", data },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error en la API route:", err);
    return NextResponse.json(
      { error: "Error en el servidor", details: err.message },
      { status: 500 }
    );
  }
}
