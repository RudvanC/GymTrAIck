// src/app/dashboard/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { fetchUserAnswersByUserId } from "@/lib/userAnswers/fetch";
import { User } from "@supabase/supabase-js";

interface UserAnswer {
  id: string;
  created_at: string;
  training_experience: string;
  availability: string;
  injuries: string;
  equipment_access: boolean;
  goal: string;
  fitness_level: string;
  session_duration: string;
}

export default function Dashboard({ user }: { user: User }) {
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      if (error || !data.user) {
        setError("Usuario no autenticado");
        setLoading(false);
      } else {
        setUserId(data.user.id);
      }
    });
  }, []);

  useEffect(() => {
    if (!userId) return;

    async function loadAnswers() {
      try {
        const data = await fetchUserAnswersByUserId(userId as string);
        setAnswers(data || []);
      } catch (err: any) {
        setError(err.message || "Error al cargar respuestas");
      } finally {
        setLoading(false);
      }
    }
    loadAnswers();
  }, [userId]);

  if (loading) return <p>Cargando respuestas...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6">Mis respuestas</h1>
      {answers.length === 0 ? (
        <p>No tienes respuestas registradas.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Fecha</th>
              <th className="border border-gray-300 p-2">Experiencia</th>
              <th className="border border-gray-300 p-2">Disponibilidad</th>
              <th className="border border-gray-300 p-2">Lesiones</th>
              <th className="border border-gray-300 p-2">Acceso a equipo</th>
              <th className="border border-gray-300 p-2">Objetivo</th>
              <th className="border border-gray-300 p-2">Nivel físico</th>
              <th className="border border-gray-300 p-2">Duración sesión</th>
            </tr>
          </thead>
          <tbody>
            {answers.map((ans) => (
              <tr key={ans.id}>
                <td className="border border-gray-300 p-2">
                  {new Date(ans.created_at).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 p-2">
                  {ans.training_experience}
                </td>
                <td className="border border-gray-300 p-2">
                  {ans.availability}
                </td>
                <td className="border border-gray-300 p-2">
                  {ans.injuries || "-"}
                </td>
                <td className="border border-gray-300 p-2">
                  {ans.equipment_access ? "Sí" : "No"}
                </td>
                <td className="border border-gray-300 p-2">{ans.goal}</td>
                <td className="border border-gray-300 p-2">
                  {ans.fitness_level}
                </td>
                <td className="border border-gray-300 p-2">
                  {ans.session_duration}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
