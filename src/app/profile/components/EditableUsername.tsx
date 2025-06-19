// src/app/profile/components/EditableUsername.tsx

"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User as UserIcon, Check, X } from "lucide-react";

interface EditableUsernameProps {
  initialUsername: string | null;
  onUpdate: () => void; // Función para refrescar los datos (mutate)
}

export default function EditableUsername({
  initialUsername,
  onUpdate,
}: EditableUsernameProps) {
  const { user, supabase } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(initialUsername || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!user || !username.trim()) return; // No guardar si está vacío

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ username: username.trim() })
        .eq("id", user.id);

      if (error) throw error;

      // Si todo va bien, notificamos al padre para que refresque y salimos del modo edición
      onUpdate();
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar el nombre de usuario:", error);
      alert("No se pudo guardar el nombre de usuario.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Restauramos el nombre original y salimos del modo edición
    setUsername(initialUsername || "");
    setIsEditing(false);
  };

  // Modo Edición
  if (isEditing) {
    return (
      <div className="p-2 m-4F rounded-lg bg-slate-800/50 border border-slate-700">
        <Label htmlFor="username-input" className="text-sm text-slate-400">
          Editar Nombre de Usuario
        </Label>
        <div className="flex items-center gap-2 mt-2">
          <Input
            id="username-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-slate-900 text-white border-slate-600"
          />
          <Button
            size="icon"
            onClick={handleSave}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleCancel}
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Modo Vista (por defecto)
  return (
    <div className="flex items-center justify-between gap-4 p-2 -m-2 rounded-lg transition-colors hover:bg-slate-800/50">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400">
          <UserIcon size={20} />
        </div>
        <div>
          <p className="text-sm text-slate-400">Nombre de Usuario</p>
          <p className="font-semibold text-white">
            {initialUsername || "No especificado"}
          </p>
        </div>
      </div>
      <Button
        className="bg-white text-black hover:bg-cyan-600"
        size="sm"
        onClick={() => setIsEditing(true)}
      >
        Editar
      </Button>
    </div>
  );
}
