"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import useSWR, { mutate } from "swr";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ChatWindow from "@/app/groups/components/ChatWindow";
import { Button } from "@/components/ui/button";
import CreateGroupDialog from "./CreateGroupDialog";

type Group = {
  id: string;
  name: string;
  description: string | null;
};

// Fetcher para obtener la lista de grupos (sin cambios)
const groupsFetcher = async (url: string, supabase: any) => {
  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .order("name");
  if (error) throw error;
  return data as Group[];
};

export default function CommunityPage() {
  const { user, supabase } = useAuth();
  const [activeGroup, setActiveGroup] = useState<Group | null>(null);
  const [joiningGroupId, setJoiningGroupId] = useState<string | null>(null);

  const {
    data: groups,
    error,
    isLoading,
  } = useSWR(["groups", supabase], ([url, supabaseClient]) =>
    groupsFetcher(url, supabaseClient)
  );

  const handleJoinGroup = async (group: Group) => {
    // ... (esta función no necesita cambios)
    if (!user || !supabase) {
      alert("Necesitas iniciar sesión para unirte a un grupo.");
      return;
    }
    setJoiningGroupId(group.id);
    try {
      const { error } = await supabase
        .from("group_members")
        .upsert(
          { group_id: group.id, user_id: user.id, role: "member" },
          { onConflict: "group_id, user_id", ignoreDuplicates: true }
        );
      if (error) throw error;
      setActiveGroup(group);
    } catch (error: any) {
      console.error("Error al unirse al grupo:", error);
      alert(`Error al unirse al grupo: ${error.message}`);
    } finally {
      setJoiningGroupId(null);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">Error al cargar los grupos.</p>;

  // Vista del Chat Activo (ya es bastante responsive)
  if (activeGroup) {
    return (
      // Aplicamos el mismo padding responsive que en la vista de lista
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <Button
          onClick={() => setActiveGroup(null)}
          className="mb-4 hover:bg-cyan-700 hover:transition-colors duration-300 ease-in-out hover:text-white"
        >
          &larr; Volver a la lista de grupos
        </Button>
        <ChatWindow group={activeGroup} />
      </div>
    );
  }

  // Vista del Lobby (Lista de Grupos)
  return (
    // ===== 1. CONTENEDOR PRINCIPAL RESPONSIVE =====
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      {/* - p-4: Padding base para móviles.
        - md:p-6 lg:p-8: Padding más grande para tablets y escritorio.
      */}

      {/* ===== 2. CABECERA RESPONSIVE ===== */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:justify-between sm:items-center">
        {/* - flex-col: En móvil, el título y el botón se apilan.
          - gap-4: Espacio entre el título y el botón en móvil.
          - sm:flex-row: En pantallas pequeñas y más, vuelven a estar en una fila.
        */}
        <h1 className="text-3xl font-bold">Comunidades</h1>
        <CreateGroupDialog
          onGroupCreated={() => mutate(["groups", supabase])}
        />
      </div>

      {/* ===== 3. CUADRÍCULA RESPONSIVE (CON GAP AJUSTADO) ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* - Tu grid ya era responsive, ¡lo cual es genial!
          - gap-4 md:gap-6: Solo ajustamos el espaciado para que sea menor en móviles.
        */}
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
              onClick={() => handleJoinGroup(group)}
              disabled={joiningGroupId === group.id}
              className="mt-4 w-full bg-cyan-600 hover:bg-cyan-700"
            >
              {joiningGroupId === group.id ? "Entrando..." : "Entrar al Chat"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
