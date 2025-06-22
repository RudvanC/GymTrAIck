"use client";

import { useAuth } from "@/context/AuthContext";
import useSWR from "swr";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import AvatarUploader from "@/app/dashboard/components/AvatarUploader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, CalendarClock } from "lucide-react";
import EditableUsername from "./EditableUsername";

// El componente InfoRow no necesita cambios, está perfecto.
const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | undefined | null;
}) => (
  <div className="flex items-center gap-4 transition-colors p-2 rounded-lg -m-2 hover:bg-slate-800/50">
    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400">
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-400">{label}</p>
      <p className="font-semibold text-white break-all">
        {value || "Not specified"}
      </p>
    </div>
  </div>
);

export default function ProfilePage() {
  const { user, supabase, loading: authLoading } = useAuth();

  const {
    data: profile,
    error,
    isLoading,
    mutate,
  } = useSWR(user ? `profile-${user.id}` : null, async () => {
    // ... tu lógica de fetch no cambia ...
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user!.id)
      .single();
    if (error) throw new Error(error.message);
    return data;
  });

  const handleAvatarUpdate = () => {
    mutate();
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-950">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    // ... manejo de errores no cambia ...
  }

  if (!user || !profile) {
    // ... manejo de perfil no encontrado no cambia ...
  }

  return (
    <div className="w-full text-slate-50">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Tu Perfil
          </h1>
          <p className="text-slate-400 mt-2">
            Gestiona tu información personal y actualiza tu avatar.
          </p>
        </header>

        {/* ===== INICIO DE LA NUEVA ESTRUCTURA DE UNA SOLA TARJETA ===== */}
        <main>
          {/* 1. Unificamos todo dentro de una sola Card. */}
          <Card className="w-full bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 shadow-2xl rounded-2xl">
            <CardContent className="p-6 md:p-8">
              {/* 2. Creamos un Grid responsive para el layout interno. */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                {/* --- Columna para el Avatar --- */}
                {/* En móvil ocupa una columna, en LG también, pero el grid lo posiciona. */}
                <div className="flex flex-col items-center text-center pt-4 lg:border-r lg:border-slate-700/50 lg:pr-12">
                  <AvatarUploader
                    initialAvatarUrl={profile.avatar_url}
                    onUploadSuccess={handleAvatarUpdate}
                    userEmail={user?.email}
                  />
                  <p className="text-xs text-slate-500 mt-4 max-w-xs">
                    Sube una imagen.
                  </p>
                </div>

                {/* --- Columna para los Detalles --- */}
                {/* En móvil ocupa una columna, en LG le decimos que ocupe las 2 restantes. */}
                <div className="space-y-6 lg:col-span-2">
                  <EditableUsername
                    initialUsername={profile.username}
                    onUpdate={mutate}
                  />
                  <Separator className="bg-slate-700/50" />
                  <InfoRow
                    icon={<Mail size={20} />}
                    label="Email"
                    value={user?.email}
                  />
                  <InfoRow
                    icon={<CalendarClock size={20} />}
                    label="Miembro desde"
                    value={new Date(user?.created_at || "").toLocaleDateString(
                      "es-ES",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
        {/* ===== FIN DE LA NUEVA ESTRUCTURA ===== */}
      </div>
    </div>
  );
}
