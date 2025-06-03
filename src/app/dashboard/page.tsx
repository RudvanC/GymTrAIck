// src/app/dashboard/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { fetchUserAnswersByUserId } from "@/lib/userAnswers/fetch";
import { User } from "@supabase/supabase-js";
import UserAnswers from "@/components/dashboard/UserAnswers";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <UserAnswers user={user as User} />
    </div>
  );
}
