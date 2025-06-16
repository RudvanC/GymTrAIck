"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
// CAMBIO 1: Importamos el hook desde la nueva ubicación (el contexto)
import { useAuth } from "@/context/AuthContext";

export default function LoginForm() {
  // CAMBIO 2: Obtenemos 'supabase' directamente desde el hook. Ya no hay una función 'signIn'.
  const { supabase } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      // CAMBIO 3: Usamos el cliente de supabase para llamar a la función de autenticación
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // Si Supabase devuelve un error, lo mostramos
      if (signInError) {
        throw signInError;
      }

      // Si el login es exitoso, el listener en AuthProvider se encargará de actualizar el estado global.
      // Ya no necesitamos el mensaje de "revisa tu correo" para un login con contraseña.
      // router.refresh() es útil para que el servidor re-renderice con la nueva sesión.
      router.refresh();
      router.push("/routine");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Error durante el inicio de sesión."
      );
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
          {/* He comentado la CardAction para que no de error si no la usas */}
          {/* <CardAction className="flex justify-center">
            <Link href="/auth/register" className="text-white font-semibold">
              ¿No tienes cuenta? Regístrate
            </Link>
          </CardAction> */}
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-4 max-w-md mx-auto p-12"
          >
            <div>
              <label htmlFor="email" className="sr-only">
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                placeholder="Correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 border rounded text-white font-semibold bg-zinc-700 border-zinc-600 placeholder-zinc-400 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 border rounded text-white font-semibold bg-zinc-700 border-zinc-600 placeholder-zinc-400 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full px-4 py-2 rounded font-semibold transition-colors duration-150 ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>

            {error && (
              <p className="text-red-500 text-sm text-center mt-2">{error}</p>
            )}
            {message && (
              <p className="text-green-500 text-sm text-center mt-2">
                {message}
              </p>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-zinc-400 font-semibold">Olvide mi contraseña</p>
        </CardFooter>
      </Card>
    </div>
  );
}
