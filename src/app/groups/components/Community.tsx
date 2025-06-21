// src/app/community/page.tsx

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
  const { user, supabase } = useAuth(); // MODIFICADO: También necesitamos el 'user'
  const [activeGroup, setActiveGroup] = useState<Group | null>(null);

  // NUEVO: Estado para saber en qué grupo nos estamos uniendo y mostrar un feedback
  const [joiningGroupId, setJoiningGroupId] = useState<string | null>(null);

  const {
    data: groups,
    error,
    isLoading,
  } = useSWR(["groups", supabase], ([url, supabaseClient]) =>
    groupsFetcher(url, supabaseClient)
  );

  // NUEVO: Función para unirse a un grupo
  const handleJoinGroup = async (group: Group) => {
    if (!user || !supabase) {
      alert("Necesitas iniciar sesión para unirte a un grupo.");
      return;
    }

    setJoiningGroupId(group.id); // Inicia el estado de carga

    try {
      // Usamos 'upsert' para añadir al usuario como miembro.
      // 'upsert' intentará insertar. Si ya existe (conflicto en la clave primaria o restricción única),
      // no hará nada o actualizará, evitando errores si el usuario ya es miembro.
      const { error } = await supabase.from("group_members").upsert(
        {
          group_id: group.id,
          user_id: user.id,
          role: "member", // Asignamos un rol por defecto
        },
        {
          onConflict: "group_id, user_id",
          ignoreDuplicates: true,
        }
      );

      if (error) {
        throw error;
      }

      // Si todo va bien, ahora sí entramos al chat
      setActiveGroup(group);
    } catch (error: any) {
      console.error("Error al unirse al grupo:", error);
      alert(`Error al unirse al grupo: ${error.message}`);
    } finally {
      setJoiningGroupId(null); // Termina el estado de carga, tanto en éxito como en error
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">Error al cargar los grupos.</p>;

  if (activeGroup) {
    return (
      <div className="container mx-auto p-4">
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

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Comunidades</h1>
        <CreateGroupDialog
          onGroupCreated={() => mutate(["groups", supabase])}
        />
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
            {/* MODIFICADO: El botón ahora llama a handleJoinGroup y muestra un estado de carga */}
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
