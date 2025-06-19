// app/profile/page.tsx (Versión Mejorada)

"use client";

import { useAuth } from "@/context/AuthContext";
import useSWR from "swr";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import AvatarUploader from "@/app/profile/components/AvatarUploader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { KeyRound, Mail, CalendarClock, User as UserIcon } from "lucide-react";

// MEJORA: El InfoRow ahora tiene un estilo más limpio y un icono más prominente.
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
        {value || "No especificado"}
      </p>
    </div>
  </div>
);

// Por consistencia, renombramos el componente a ProfilePage
export default function ProfilePage() {
  const { user, supabase, loading: authLoading } = useAuth();

  const {
    data: profile,
    error,
    isLoading,
    mutate,
  } = useSWR(user ? `profile-${user.id}` : null, async () => {
    // Tu lógica de fetcher con SWR está perfecta, la mantenemos.
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
      <div className="flex justify-center items-center h-screen bg-slate-950">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center mt-20 text-red-500">
        Error al cargar el perfil: {error.message}
      </p>
    );
  }

  if (!user || !profile) {
    return (
      <p className="text-center mt-20 text-slate-400">
        No se pudo encontrar el perfil de usuario.
      </p>
    );
  }

  return (
    // MEJORA: Añadimos un fondo degradado sutil a toda la página
    <div className="bg-slate-950 text-slate-50 min-h-screen bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Tu Perfil
          </h1>
          <p className="text-slate-400 mt-2 max-w-2xl">
            Gestiona tu información personal, actualiza tu foto y revisa los
            detalles de tu cuenta.
          </p>
        </header>

        {/* --- MEJORA DE LAYOUT: Pasamos de Flex a un Grid más robusto y responsivo --- */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* --- Columna Izquierda: Tarjeta de Identidad --- */}
          <div className="lg:col-span-1 lg:sticky lg:top-8">
            <Card className="w-full bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 shadow-2xl rounded-2xl">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <AvatarUploader
                  initialAvatarUrl={profile.avatar_url} // Se lo pasamos desde el 'profile' de SWR
                  onUploadSuccess={handleAvatarUpdate}
                  userEmail={user.email}
                />
              </CardContent>
            </Card>
          </div>

          {/* --- Columna Derecha: Tarjeta de Información --- */}
          <div className="lg:col-span-2">
            <Card className="w-full bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 shadow-2xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white">
                  Detalles de la Cuenta
                </CardTitle>
                <Separator className="mt-2 bg-slate-700/50" />
              </CardHeader>
              <CardContent className="space-y-6">
                <InfoRow
                  icon={<UserIcon size={20} />}
                  label="Nombre de Usuario"
                  value={profile.username}
                />
                <InfoRow
                  icon={<Mail size={20} />}
                  label="Email"
                  value={user.email}
                />
                <InfoRow
                  icon={<CalendarClock size={20} />}
                  label="Miembro desde"
                  value={new Date(user.created_at).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
