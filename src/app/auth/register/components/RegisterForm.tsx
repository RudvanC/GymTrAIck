"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext"; // Usamos el hook del contexto
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"; // Importamos toast
import { Mail, Lock, User } from "lucide-react";

export default function RegisterForm() {
  const { supabase } = useAuth(); // Obtenemos supabase desde el contexto
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Lógica de registro encapsulada en una promesa para usar con toast.promise
    const registerPromise = async () => {
      if (!email || !password || !username) {
        throw new Error("Todos los campos son obligatorios.");
      }
      if (password.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres.");
      }

      // Creamos el usuario en Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Podemos pasar el username aquí para usarlo después
          data: {
            username: username,
          },
        },
      });

      if (signUpError) throw signUpError;
      if (!data.user) throw new Error("No se pudo crear el usuario.");

      // Insertamos el perfil en nuestra tabla 'profiles'
      // Supabase se encarga de disparar un trigger para esto, pero un upsert manual es más explícito
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: data.user.id,
        username: username,
        email: email,
      });

      if (profileError) throw profileError;
    };

    // 2. Usamos toast.promise para un feedback de usuario increíble
    toast.promise(registerPromise(), {
      loading: "Creando tu cuenta...",
      success: () => {
        // Redirigimos después de un momento para que el usuario vea el mensaje
        setTimeout(() => {
          router.push("/questionnaire");
        }, 1500);
        return "¡Cuenta creada con éxito! Serás redirigido.";
      },
      error: (err) => err.message, // Muestra el mensaje de error que lanzamos
      finally: () => {
        setLoading(false);
      },
    });
  };

  return (
    // 3. Contenedor principal con el fondo y la animación.
    <div className="flex flex-col items-center justify-center min-w-screen min-h-screen p-4 bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      {/* 4. La Card con el estilo 'glassmorphism' */}
      <Card className="w-full max-w-md bg-slate-900/50 backdrop-blur-lg border border-slate-700/50 shadow-2xl animate-fade-in-up">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-white">
            Crea tu Cuenta
          </CardTitle>
          <CardDescription className="text-slate-400">
            Empieza tu viaje fitness hoy mismo.
          </CardDescription>
        </CardHeader>

        {/* 5. El <form> envolviendo el contenido para mejor estructura */}
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-6">
            {/* 6. Inputs modernos con iconos y estilos cohesivos */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                id="username"
                type="text"
                placeholder="Nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="pl-10 h-12 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-cyan-400"
              />
            </div>

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

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                id="password"
                type="password"
                placeholder="Contraseña (mín. 6 caracteres)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 h-12 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-cyan-400"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            {/* 7. Botón de registro con el estilo de la marca */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-md mt-6 font-semibold bg-cyan-600 text-white hover:bg-cyan-700 transition-all duration-300 hover:scale-105 disabled:opacity-50"
            >
              {loading ? "Creando cuenta..." : "Registrarse"}
            </Button>

            {/* 8. Enlace de 'Iniciar sesión' movido al footer */}
            <p className="text-xs text-slate-400">
              ¿Ya tienes una cuenta?{" "}
              <Link
                href="/auth/login"
                className="font-semibold text-cyan-400 hover:underline"
              >
                Inicia sesión
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
