// src/app/api/user-answers/route.ts

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

// --- GET CORREGIDO ---
export async function GET(request: Request) {
  // Lógica de cliente Supabase, ahora directamente aquí.
  const cookieStore = await cookies(); // SIN await, esto es correcto.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (error) {
            // Ignorar en Route Handlers.
          }
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("user_answers")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error al obtener respuestas:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// --- POST CORREGIDO ---
export async function POST(request: Request) {
  // Lógica de cliente Supabase, repetida para asegurar el contexto.
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (error) {
            /* Ignorar */
          }
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const securePayload = { ...payload, user_id: session.user.id };

    const { data, error } = await supabase
      .from("user_answers")
      .insert(securePayload)
      .select()
      .single();

    if (error) {
      console.error("Error de Supabase en POST:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err: unknown) {
    console.error("Error general en POST:", err);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}

// --- PATCH CORREGIDO ---
export async function PATCH(request: Request) {
  // Lógica de cliente Supabase, repetida una vez más.
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (error) {
            /* Ignorar */
          }
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const answerId = searchParams.get("id");

  if (!answerId) {
    return NextResponse.json(
      { error: "Falta el ID de la respuesta a actualizar" },
      { status: 400 }
    );
  }

  try {
    const payload = await request.json();

    const { data, error } = await supabase
      .from("user_answers")
      .update(payload)
      .eq("id", answerId)
      .eq("user_id", session.user.id)
      .select()
      .single();

    if (error) {
      console.error("Error de Supabase en PATCH:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json(
        { error: "Respuesta no encontrada o no tienes permiso para editarla" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    console.error("Error general en PATCH:", err);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}
