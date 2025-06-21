/**
 * AuthProvider and useAuth Hook
 *
 * Provides authentication context using Supabase.
 * - Exposes the current user, loading state, and the Supabase client
 * - Automatically listens to auth state changes (login/logout)
 * - Prevents rendering children until auth status is known
 *
 * Usage:
 * Wrap your app with <AuthProvider> to access `useAuth()` anywhere.
 */

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/supabaseClient";
import type {
  User,
  SupabaseClient,
  AuthChangeEvent,
  Session,
} from "@supabase/supabase-js";

// Type definition for the auth context
interface AuthContextType {
  user: User | null;
  supabase: SupabaseClient;
  loading: boolean;
}

// Create the context with undefined as default to enforce usage within provider
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Context provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the initial user session
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    }

    getUser();

    // Subscribe to auth state changes (login, logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        console.log("Auth event:", event);
        console.log("Session:", session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const value = {
    user,
    supabase,
    loading,
  };

  // Prevent rendering children until auth state is determined
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Custom hook to access the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
