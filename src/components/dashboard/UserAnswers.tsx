"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { fetchUserAnswersByUserId } from "@/lib/userAnswers/fetch";
import { User } from "@supabase/supabase-js";
import { UserAnswer } from "@/types/UserAnswer";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className="max-w-6xl mx-auto pt-20 px-4">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-800">
        Mis respuestas
      </h1>

      {answers.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          No tienes respuestas registradas.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {answers.map((ans) => (
            <Card key={ans.id}>
              <CardHeader>
                <CardTitle>
                  Fecha:{" "}
                  <span className="text-gray-400">
                    {new Date(ans.created_at).toLocaleDateString()}
                  </span>
                </CardTitle>
              </CardHeader>

              <CardContent className="mb-2">
                <span className="font-semibold">Experiencia:</span>{" "}
                <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full capitalize">
                  {ans.training_experience}
                </span>
              </CardContent>

              <CardContent className="mb-2">
                <span className="font-semibold">Disponibilidad:</span>{" "}
                <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full capitalize">
                  {ans.availability}
                </span>
              </CardContent>

              <CardContent className="mb-2">
                <span className="font-semibold">Lesiones:</span>{" "}
                <span className="italic text-gray-600">
                  {ans.injuries || "Ninguna"}
                </span>
              </CardContent>

              <CardContent className="mb-2">
                <span className="font-semibold">Acceso a equipo:</span>{" "}
                {ans.equipment_access ? "✅" : "❌"}
              </CardContent>

              <CardContent className="mb-2">
                <span className="font-semibold">Objetivo:</span>{" "}
                <span className="inline-block bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full capitalize">
                  {ans.goal}
                </span>
              </CardContent>

              <CardContent className="mb-2">
                <span className="font-semibold">Nivel físico:</span>{" "}
                <span className="inline-block bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full capitalize">
                  {ans.fitness_level}
                </span>
              </CardContent>

              <CardContent className="mb-2">
                <span className="font-semibold">Duración sesión:</span>{" "}
                {ans.session_duration}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
