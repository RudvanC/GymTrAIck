/**
 * @file Este archivo configura e inicializa el cliente de Supabase para ser utilizado en el navegador.
 *
 * La directiva `"use client"` asegura que este código se ejecute en el cliente.
 */
"use client";

import { createClient } from "@supabase/supabase-js";

/**
 * URL base del proyecto Supabase.
 * Se obtiene desde la variable de entorno `NEXT_PUBLIC_SUPABASE_URL`, que debe estar definida en el entorno de Next.js.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

/**
 * Clave anónima (anon key) del proyecto Supabase.
 * Esta clave se utiliza para la autenticación de clientes no privilegiados y también proviene del entorno de Next.js.
 */
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Validación en tiempo de ejecución para asegurar que las variables de entorno están definidas.
 * Lanza errores descriptivos si alguna falta, lo que facilita el debug en desarrollo.
 */
if (!supabaseUrl) {
  throw new Error(
    "Supabase URL is not defined. Please check your NEXT_PUBLIC_SUPABASE_URL environment variable."
  );
}

if (!supabaseKey) {
  throw new Error(
    "Supabase anonymous key is not defined. Please check your NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable."
  );
}

/**
 * Instancia del cliente de Supabase.
 *
 * @remarks
 * Esta instancia se exporta para ser utilizada a lo largo de toda la aplicación,
 * tanto para autenticación como para acceso a la base de datos, almacenamiento, etc.
 *
 * @example
 * import { supabase } from "@/lib/supabase";
 * const { data, error } = await supabase.from("users").select("*");
 */
export const supabase = createClient(supabaseUrl, supabaseKey);
