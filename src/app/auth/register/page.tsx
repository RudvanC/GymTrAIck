"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    console.log("Email:", email);
    console.log("Password:", password);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: cleanEmail,
      password: cleanPassword,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      console.error("Error al registrar:", signUpError);
      return;
    }

    const user = data.user;
    if (user) {
      // Insertar en la tabla profile
      const { error: dbError } = await supabase
        .from("profiles")
        .upsert({ id: user.id, username });
      if (dbError) {
        setError("Registro falló al guardar el username");
      }
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4 max-w-md mx-auto">
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
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Registrando..." : "Registrarse"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
