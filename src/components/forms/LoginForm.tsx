"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError("Todos los campos son obligatorios.");
      setLoading(false);
      return;
    }

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword,
        });

      if (loginError) {
        console.error("Error en login:", loginError);
        setError("Correo o contraseña incorrectos.");
        setLoading(false);
        return;
      }

      // ✅ Redirigir al dashboard si todo está bien
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Error inesperado:", err);
      setError("Algo salió mal. Intenta de nuevo.");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form
        onSubmit={handleLogin}
        className="space-y-4 max-w-md mx-auto border p-12 rounded-md shadow-md"
      >
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded"
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
    </div>
  );
}
