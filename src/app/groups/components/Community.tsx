// src/app/community/page.tsx

"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import useSWR from "swr";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ChatWindow from "@/app/groups/components/ChatWindow";
import { Button } from "@/components/ui/button";

type Group = {
  id: string;
  name: string;
  description: string | null;
};

// Fetcher para obtener la lista de grupos
const groupsFetcher = async (url: string, supabase: any) => {
  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .order("name");
  if (error) throw error;
  return data as Group[];
};

export default function CommunityPage() {
  const { supabase } = useAuth();
  const [activeGroup, setActiveGroup] = useState<Group | null>(null);

  // Usamos SWR para obtener todos los grupos disponibles
  const {
    data: groups,
    error,
    isLoading,
  } = useSWR(
    ["groups", supabase], // La key incluye supabase para que el fetcher lo reciba
    ([url, supabaseClient]) => groupsFetcher(url, supabaseClient)
  );

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">Error al cargar los grupos.</p>;

  // --- VISTA PRINCIPAL CON RENDERIZADO CONDICIONAL ---

  // Si hemos seleccionado un grupo, mostramos la ventana de chat
  if (activeGroup) {
    return (
      <div className="container mx-auto p-4">
        <Button
          onClick={() => setActiveGroup(null)}
          variant="outline"
          className="mb-4 text-black"
        >
          &larr; Volver a la lista de grupos
        </Button>
        <ChatWindow group={activeGroup} />
      </div>
    );
  }

  // Si no, mostramos el "Lobby" con la lista de grupos
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Comunidades</h1>
        <Button>Crear Nuevo Grupo</Button>{" "}
        {/* Botón para la futura funcionalidad */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups?.map((group) => (
          <div
            key={group.id}
            className="p-6 bg-slate-900 border border-slate-800 rounded-lg flex flex-col justify-between hover:border-cyan-500 transition-colors"
          >
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                {group.name}
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                {group.description || "Sin descripción."}
              </p>
            </div>
            <Button
              onClick={() => setActiveGroup(group)}
              className="mt-4 w-full bg-cyan-600 hover:bg-cyan-700"
            >
              Entrar al Chat
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
