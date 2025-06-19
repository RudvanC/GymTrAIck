// src/app/profile/components/AvatarUploader.tsx

"use client";

import { useState, useEffect } from "react";
// --- ¡LA SOLUCIÓN! ---
// 1. Importamos el cliente COMPARTIDO, el mismo que usas en AuthContext.
import { createClient } from "@/lib/supabase/supabaseClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// 2. BORRAMOS la línea que creaba un cliente nuevo y separado aquí.
// const supabase = createClient<Database>(...); <-- Esta línea se elimina

interface AvatarUploaderProps {
  initialAvatarUrl: string | null;
  onUploadSuccess: (newUrl: string) => void;
  userEmail: string | undefined;
}

export default function AvatarUploader({
  initialAvatarUrl,
  onUploadSuccess,
  userEmail,
}: AvatarUploaderProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        alert("El archivo es demasiado grande. Máximo 2MB.");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Por favor, selecciona un archivo primero.");
      return;
    }
    setUploading(true);

    try {
      // Ahora esta llamada a getSession SÍ funcionará porque usa el cliente correcto.
      const {
        data: { session },
        error: sessionError,
      } = await createClient().auth.getSession();

      if (sessionError || !session) {
        throw new Error(
          "No se pudo verificar la sesión. Por favor, inicia sesión de nuevo."
        );
      }
      const user = session.user;

      const fileExt = selectedFile.name.split(".").pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await createClient()
        .storage.from("avatars")
        .upload(filePath, selectedFile, { cacheControl: "3600", upsert: true });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = createClient().storage.from("avatars").getPublicUrl(filePath);

      const finalUrl = `${publicUrl}?t=${new Date().getTime()}`;

      const { error: updateError } = await createClient()
        .from("profiles")
        .update({ avatar_url: finalUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setAvatarUrl(finalUrl);
      onUploadSuccess(finalUrl);
      alert("¡Foto de perfil actualizada con éxito!");
    } catch (error) {
      console.error("Error detallado:", error);
      alert("Error al subir la imagen. Revisa la consola para más detalles.");
    } finally {
      setUploading(false);
      setSelectedFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-32 w-32 border-4 border-slate-700 shadow-lg">
        <AvatarImage
          src={previewUrl || avatarUrl || undefined}
          alt="Avatar de usuario"
        />
        <AvatarFallback className="text-3xl bg-slate-800 text-slate-300">
          {userEmail?.charAt(0).toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>

      <input
        type="file"
        id="avatar-upload"
        className="hidden"
        accept="image/png, image/jpeg"
        onChange={handleFileChange}
        disabled={uploading}
      />

      {!selectedFile && (
        <label htmlFor="avatar-upload" className="cursor-pointer">
          <Button asChild className="pointer-events-none">
            <span>Cambiar Foto</span>
          </Button>
        </label>
      )}

      {selectedFile && (
        <div className="flex gap-4">
          <Button onClick={handleUpload} disabled={uploading}>
            {uploading ? <Loader2 className="animate-spin" /> : "Guardar Foto"}
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setSelectedFile(null);
              setPreviewUrl(null);
            }}
            disabled={uploading}
          >
            Cancelar
          </Button>
        </div>
      )}
    </div>
  );
}
