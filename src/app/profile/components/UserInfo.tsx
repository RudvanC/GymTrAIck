/**
 * `ProfilePage` displays the authenticated user's profile.
 *
 * It provides an interface to view and manage account information,
 * including profile picture upload, username editing, and static data like email and join date.
 *
 * @remarks
 * Uses Supabase for data storage and authentication. Data is fetched via SWR and revalidated on changes.
 * Avatar uploads are handled via Supabase Storage and updated in the `profiles` table.
 * The layout uses responsive Tailwind Grid and Cards with visual enhancements (blur, shadows, etc.).
 *
 * @returns A fully responsive and editable user profile page.
 *
 * @example
 * ```tsx
 * // Rendered automatically when the user navigates to /profile
 * <ProfilePage />
 * ```
 *
 * @see {@link AvatarUploader} - Allows users to upload a new profile image.
 * @see {@link EditableUsername} - Inline editor for updating the username.
 */

"use client";

import { useAuth } from "@/context/AuthContext";
import useSWR from "swr";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import AvatarUploader from "@/app/profile/components/AvatarUploader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, CalendarClock } from "lucide-react";
import EditableUsername from "./EditableUsername";

/**
 * `InfoRow` renders a labeled piece of user information with an icon.
 *
 * @param icon - Icon to display at the beginning of the row.
 * @param label - Descriptive label (e.g., "Email").
 * @param value - Actual value (e.g., "user@example.com").
 *
 * @returns A single row of formatted user information.
 */
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
        No se pudo cargar tu perfil: {error.message}
      </p>
    );
  }

  if (!user || !profile) {
    return (
      <p className="text-center mt-20 text-slate-400">
        No se encontró tu perfil.
      </p>
    );
  }

  return (
    <div className="text-slate-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Tu Perfil
          </h1>
          <p className="text-slate-400 mt-2 max-w-2xl">
            Gestiona tu información personal, actualiza tu avatar y revisa tus
            detalles de cuenta.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Avatar Section */}
          <div className="lg:col-span-1 lg:sticky lg:top-8">
            <Card className="w-full bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 shadow-2xl rounded-2xl">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <AvatarUploader
                  initialAvatarUrl={profile.avatar_url}
                  onUploadSuccess={handleAvatarUpdate}
                  userEmail={user.email}
                />
              </CardContent>
            </Card>
          </div>

          {/* Profile Details Section */}
          <div className="lg:col-span-2">
            <Card className="w-full bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 shadow-2xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white">
                  Detalles de la cuenta
                </CardTitle>
                <Separator className="mt-2 bg-slate-700/50" />
              </CardHeader>
              <CardContent className="space-y-6">
                <EditableUsername
                  initialUsername={profile.username}
                  onUpdate={mutate}
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
