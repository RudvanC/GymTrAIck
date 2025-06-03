// src/components/LoginForm.tsx
"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function LoginForm() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
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
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 border rounded"
    >
      <h2 className="text-xl font-bold mb-4">Iniciar sesión</h2>
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full p-2 mb-2 border rounded"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {loading ? "Enviando..." : "Enviar enlace de inicio"}
      </button>
      {error && <p className="mt-2 text-red-600">{error}</p>}
      {message && <p className="mt-2 text-green-600">{message}</p>}
    </form>
  );
}
