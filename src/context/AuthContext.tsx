"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/supabaseClient";
import type {
  User,
  SupabaseClient,
  AuthChangeEvent,
  Session,
} from "@supabase/supabase-js";

// Define la estructura del contexto
interface AuthContextType {
  user: User | null;
  supabase: SupabaseClient;
  loading: boolean;
}

// Crea el contexto con un valor por defecto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Crea el componente Proveedor del contexto
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      // Obtenemos la sesión inicial
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    }

    getUser();

    // Escuchamos cambios en la autenticación (signIn, signOut)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        console.log("Event:", event);
        console.log("Session:", session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Limpiamos el listener cuando el componente se desmonta
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const value = {
    user,
    supabase,
    loading,
  };

  // El `!loading` evita mostrar contenido que dependa del usuario antes de saber si está logueado o no
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Crea un hook personalizado para usar el contexto fácilmente
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}
