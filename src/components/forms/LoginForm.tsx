// src/components/LoginForm.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
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
import { useAuth } from "@/hooks/useAuth";

export default function LoginForm() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await signIn(email, "password");
      setMessage("Correo enviado, revisa tu bandeja de entrada 📩");
    } catch (err: any) {
      setError(err.message || "Error enviando correo");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-transparent">
      <Card className="bg-transparent">
        <CardHeader>
          <CardTitle className="text-white font-semibold">
            Iniciar sesión
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Ingresa tu correo y contraseña
          </CardDescription>
          <CardAction className="flex justify-center">
            <Link href="/auth/register" className="text-white font-semibold">
              Crear cuenta
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-4 max-w-md mx-auto p-12"
          >
            <input
              type="email"
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border rounded text-white font-semibold "
            />
            <input
              type="password"
              placeholder="Contraseña"
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
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>

            {error && <p className="text-red-500 text-center">{error}</p>}
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-zinc-400 font-semibold">Olvide mi contraseña</p>
        </CardFooter>
      </Card>
    </div>
  );
}
