/**
 * @file RegisterForm.tsx
 * @description
 * Displays a registration form that allows users to sign up by providing a username, email, and password.
 * Handles input validation, user creation through Supabase authentication, and profile insertion into the database.
 * Redirects users to a questionnaire page after successful registration.
 *
 * This component is part of the user authentication flow in a fitness-related web application.
 */

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/supabaseClient";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardAction,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

/**
 * RegisterForm component allows users to sign up by entering a username, email, and password.
 * It interacts with Supabase Auth and inserts user metadata into the `profiles` table.
 *
 * After successful registration, it redirects the user to the questionnaire page.
 */
export default function RegisterForm() {
  const router = useRouter();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  /**
   * Handles the registration process.
   * - Validates input
   * - Signs the user up using Supabase Auth
   * - Inserts additional data into the `profiles` table
   * - Redirects to the questionnaire on success
   *
   * @param e - The form event
   */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    const cleanUsername = username.trim();

    if (!cleanEmail || !cleanPassword || !cleanUsername) {
      setError("All fields are required.");
      return;
    }

    if (cleanPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      const { data, error: signUpError } = await createClient().auth.signUp({
        email: cleanEmail,
        password: cleanPassword,
      });

      if (signUpError) {
        console.error("Sign-up error:", signUpError);
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      const user = data.user;
      if (user) {
        // Insert into the `profiles` table
        const { error: dbError } = await createClient()
          .from("profiles")
          .upsert({ id: user.id, username });

        if (dbError) {
          setError("Registration failed while saving the username.");
          setLoading(false);
          return;
        }

        // Redirect to questionnaire if everything succeeded
        router.push("/questionnaire");
      }

      setLoading(false);
    } catch (error) {
      console.error("Registration error:", error);
      setError("Registration failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-transparent">
      <Card className="bg-transparent">
        <CardHeader>
          <CardTitle className="text-white font-semibold">Sign up</CardTitle>
          <CardDescription className="text-zinc-400">
            Introduce un nombre de usuario, correo electrónico y contraseña para comenzar tu entrenamiento
          </CardDescription>
          <CardAction className="flex justify-center">
            <Link href="/auth/login" className="text-white font-semibold">
              Ya tienes una cuenta? Inicia sesión
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleRegister}
            className="space-y-4 max-w-md mx-auto p-12"
          >
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-2 border rounded text-white font-semibold"
            />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border rounded text-white font-semibold"
            />
            <input
              type="password"
              placeholder="Contraseña (min. 6 caracteres)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border rounded text-white font-semibold"
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-4 py-2 rounded ${
                loading
                  ? "bg-gray-400"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading ? "Registrando..." : "Registrarse"}
            </button>
            {error && <p className="text-red-500 text-center">{error}</p>}
            {success && (
              <p className="text-green-600 text-center">
                ✅ Registro exitoso! Redirigiendo...
              </p>
            )}
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-zinc-400 font-semibold">¿Olvidaste tu contraseña?</p>
        </CardFooter>
      </Card>
    </div>
  );
}
