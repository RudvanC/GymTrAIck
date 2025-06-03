"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RegisterForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    const cleanUsername = username.trim();

    if (!cleanEmail || !cleanPassword || !cleanUsername) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (cleanPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: cleanEmail,
        password: cleanPassword,
      });

      if (signUpError) {
        console.error("Error en signUp:", signUpError);
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      const user = data.user;
      if (user) {
        // Insertar en la tabla profiles
        const { error: dbError } = await supabase
          .from("profiles")
          .upsert({ id: user.id, username });
        if (dbError) {
          setError("Registro falló al guardar el username");
          setLoading(false);
          return;
        }

        // Registro y guardado en profile OK, redirigimos al cuestionario
        router.push("/questionnaire");
      }

      setLoading(false);
    } catch (error) {
      console.error("Error en el registro:", error);
      setError("Error en el registro. Por favor, intenta nuevamente.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form
        onSubmit={handleRegister}
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
          placeholder="Contraseña (mín. 6 caracteres)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-2 rounded ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {loading ? "Registrando..." : "Registrarse"}
        </button>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && (
          <p className="text-green-600 text-center">
            ✅ ¡Registro exitoso! Redirigiendo...
          </p>
        )}
      </form>
    </div>
  );
}
