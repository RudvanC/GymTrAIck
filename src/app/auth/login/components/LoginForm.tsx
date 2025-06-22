"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Usamos el Input de shadcn
import { Label } from "@/components/ui/label";
import { Mail, Lock } from "lucide-react";

export default function LoginForm() {
  const { supabase } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    // Forzamos un refresh para que el layout del servidor sepa que estamos logueados
    // y redirigimos al dashboard.
    router.refresh();
    router.push("/dashboard");
  };

  return (
    // 1. Contenedor principal con el fondo de la aplicación
    <div className="flex flex-col items-center justify-center min-w-screen min-h-screen p-4 bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      {/* 2. La Card principal con efecto de cristal y animación */}
      <Card className="w-full max-w-md bg-slate-900/50 backdrop-blur-lg border border-slate-700/50 shadow-2xl animate-fade-in-up">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-white">
            Bienvenido de Vuelta
          </CardTitle>
          <CardDescription className="text-slate-400">
            Ingresa a tu cuenta para continuar
          </CardDescription>
        </CardHeader>

        {/* 3. El <form> ahora envuelve el contenido y el footer para una mejor semántica */}
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* 4. Input de Email moderno con icono */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 h-12 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-cyan-400"
              />
            </div>

            {/* 5. Input de Contraseña moderno con icono */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                id="password"
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 h-12 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-cyan-400"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center pt-2">{error}</p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4 mt-6">
            {/* 6. Botón de acción con el nuevo estilo cian */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-md font-semibold bg-cyan-600 text-white hover:bg-cyan-700 transition-all duration-300 hover:scale-105 disabled:opacity-50"
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>

            {/* 7. Enlaces de ayuda con estilos sutiles */}
            <p className="text-xs text-slate-400">
              ¿No tienes una cuenta?{" "}
              <Link
                href="/auth/register"
                className="font-semibold text-cyan-400 hover:underline"
              >
                Regístrate
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
