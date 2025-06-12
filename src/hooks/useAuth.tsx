"use client";
import { useState, useEffect, useCallback } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { User, AuthError } from "@supabase/supabase-js";

// Defines the shape of the value returned by the useAuth hook
export interface AuthState {
  user: User | null;
  loading: boolean; // Indicates if the auth state is being determined or an operation is in progress
  error: AuthError | null; // Stores any authentication error during operations
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  // Consider adding a signUp function here for consistency:
  // signUp: (email: string, password: string, options?: { data: any }) => Promise<User | null>;
}

// Custom hook to manage user authentication with Supabase.
export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // True initially until session is fetched or an operation is in progress
  const [error, setError] = useState<AuthError | null>(null); // To store errors from signIn/signOut/signUp

  useEffect(() => {
    setLoading(true); // Set loading true when initially checking session
    supabaseClient.auth
      .getSession()
      .then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        setLoading(false); // Finished initial loading
      })
      .catch((err) => {
        console.error("Error getting session:", err);
        // Potentially set an error state here if needed for initial session fetch failure
        setLoading(false); // Finished initial loading even on error
      });

    // Subscribe to authentication state changes
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        // This listener reflects the current auth state, so initial loading is effectively done if session is known.
        // If there was an ongoing operation (signIn/signOut) that triggered this, its own setLoading(false) will handle it.
        setLoading(false);
        setError(null); // Clear previous operational errors on auth state change
      }
    );

    // Cleanup: Unsubscribe from the listener when the component unmounts
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Signs in the user with email and password.
  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error: signInError } =
        await supabaseClient.auth.signInWithPassword({
          email,
          password,
        });
      if (signInError) {
        // The onAuthStateChange listener will update the user to null if signIn fails due to bad creds.
        // However, we want to surface the specific error from signInWithPassword.
        setError(signInError);
        throw signInError;
      }
      // Successful sign-in will trigger onAuthStateChange, which updates user and sets loading to false.
    } catch (err: any) {
      // If it's not already an AuthError, wrap it or handle as needed.
      // setError is already called if signInError was thrown.
      if (!(err instanceof AuthError)) {
        console.error("SignIn non-AuthError:", err);
        setError({
          name: "SignInError",
          message: err.message || "An unknown error occurred during sign in.",
        } as AuthError);
      }
      throw err; // Re-throw for the component to handle UI updates (e.g., error messages)
    } finally {
      // setLoading(false) // Managed by onAuthStateChange or if error occurs before it fires
      // Let onAuthStateChange handle final setLoading(false) on successful login,
      // or if an error happens before that (like network), this finally might be too soon.
      // The primary setLoading is for the operation itself, onAuthStateChange handles the user state loading.
    }
  }, []);

  // Signs out the current user.
  const signOut = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { error: signOutError } = await supabaseClient.auth.signOut();
      if (signOutError) {
        setError(signOutError);
        throw signOutError;
      }
      setUser(null); // Explicitly set user to null, onAuthStateChange will also fire.
      setLoading(false); // SignOut is complete
    } catch (err: any) {
      if (!(err instanceof AuthError)) {
        console.error("SignOut non-AuthError:", err);
        setError({
          name: "SignOutError",
          message: err.message || "An unknown error occurred during sign out.",
        } as AuthError);
      }
      setLoading(false); // Ensure loading is false even if an error occurs
      throw err; // Re-throw for the component to handle
    }
  }, []);

  // Placeholder for a potential signUp function
  /*
  const signUp = useCallback(async (email: string, password: string, options?: { data: any }) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: signUpError } = await supabaseClient.auth.signUp({ email, password, options });
      if (signUpError) {
        setError(signUpError);
        throw signUpError;
      }
      // User state will be updated by onAuthStateChange eventually.
      // setLoading(false) will be handled by onAuthStateChange if successful.
      return data.user; // or data.session?.user
    } catch (err: any) {
      if (!(err instanceof AuthError)) {
         setError({ name: "SignUpError", message: err.message || "An unknown error occurred during sign up."} as AuthError)
      }
      // setLoading(false); // Let onAuthStateChange handle final setLoading if error doesn't occur too early
      throw err;
    }
  }, []);
  */

  return { user, signIn, signOut, loading, error };
}
