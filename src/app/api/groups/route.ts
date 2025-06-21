// src/app/api/groups/route.ts

import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Esquema de validación con Zod
const createGroupSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres.")
    .max(50),
  description: z
    .string()
    .max(200, "La descripción no puede superar los 200 caracteres.")
    .optional(),
});

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  // 1. Verificar si el usuario está autenticado
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const user = session.user;

  // 2. Validar el cuerpo de la petición
  const body = await req.json();
  const validation = createGroupSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { errors: validation.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { name, description } = validation.data;

  // 3. Insertar el nuevo grupo y añadir al creador como miembro en una transacción
  // Usar una RPC (función de base de datos) es la forma más segura de hacer esto como una transacción.

  // Primero, crea la función en tu base de datos yendo al editor SQL de Supabase:
  /*
    CREATE OR REPLACE FUNCTION create_group_and_add_creator(
      group_name TEXT,
      group_description TEXT,
      creator_id UUID
    )
    RETURNS TABLE (id UUID, name TEXT, description TEXT) AS $$
    DECLARE
      new_group_id UUID;
    BEGIN
      -- Insertar el nuevo grupo y obtener su ID
      INSERT INTO public.groups (name, description)
      VALUES (group_name, group_description)
      RETURNING public.groups.id INTO new_group_id;

      -- Insertar al creador como el primer miembro
      INSERT INTO public.group_members (group_id, user_id)
      VALUES (new_group_id, creator_id);
      
      -- Devolver el grupo recién creado
      RETURN QUERY SELECT g.id, g.name, g.description FROM public.groups g WHERE g.id = new_group_id;
    END;
    $$ LANGUAGE plpgsql;
  */

  const { data: newGroup, error } = await supabase
    .rpc("create_group_and_add_creator", {
      group_name: name,
      group_description: description,
      creator_id: user.id,
    })
    .single(); // .single() para obtener un solo objeto en lugar de un array

  if (error) {
    console.error("Error creating group:", error);
    return NextResponse.json(
      { error: "No se pudo crear el grupo." },
      { status: 500 }
    );
  }

  return NextResponse.json(newGroup, { status: 201 });
}
