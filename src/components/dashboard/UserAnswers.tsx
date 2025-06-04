"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { fetchUserAnswersByUserId } from "@/lib/userAnswers/fetch";
import { User } from "@supabase/supabase-js";
import { LoadingSpinner } from "../common/LoadingSpinner";

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

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <p className="text-center mt-20 text-red-600 font-semibold">{error}</p>
    );

  return (
    <div className="max-w-6xl mx-auto pt-20 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-800">
        Mis respuestas
      </h1>
      {answers.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          No tienes respuestas registradas.
        </p>
      ) : (
        <table className="min-w-full border-collapse text-gray-700">
          <thead>
            <tr className="bg-gray-100 text-left text-sm uppercase font-semibold tracking-wide text-gray-600">
              <th className="p-3 border-b border-gray-300">Fecha</th>
              <th className="p-3 border-b border-gray-300">Experiencia</th>
              <th className="p-3 border-b border-gray-300">Disponibilidad</th>
              <th className="p-3 border-b border-gray-300">Lesiones</th>
              <th className="p-3 border-b border-gray-300">Acceso a equipo</th>
              <th className="p-3 border-b border-gray-300">Objetivo</th>
              <th className="p-3 border-b border-gray-300">Nivel físico</th>
              <th className="p-3 border-b border-gray-300">Duración sesión</th>
            </tr>
          </thead>
          <tbody>
            {answers.map((ans, idx) => (
              <tr
                key={ans.id}
                className={`border-b border-gray-200 hover:bg-gray-50 ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="p-3">
                  {new Date(ans.created_at).toLocaleDateString()}
                </td>
                <td className="p-3 capitalize">{ans.training_experience}</td>
                <td className="p-3 capitalize">{ans.availability}</td>
                <td className="p-3 italic text-gray-500">
                  {ans.injuries || "-"}
                </td>
                <td className="p-3 text-center">
                  {ans.equipment_access ? "✅" : "❌"}
                </td>
                <td className="p-3 capitalize">{ans.goal}</td>
                <td className="p-3 capitalize">{ans.fitness_level}</td>
                <td className="p-3 capitalize">{ans.session_duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
