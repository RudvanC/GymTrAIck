"use client";

import Link from "next/link";
import {
  Dumbbell,
  BarChart,
  LayoutDashboard,
  LogOut,
  ListTree,
  User,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";

import { createClient } from "@/lib/supabase/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import useSWR from "swr";

export default function Sidebar() {
  const { user, supabase } = useAuth();
  const router = useRouter();

  // 4. Usamos SWR para obtener los datos del perfil
  // La 'key' depende del user.id. Si no hay usuario, la key es null y SWR no hace nada.
  const { data: profile } = useSWR(
    user ? `profile-${user.id}` : null, // Key única para SWR
    async () => {
      // El fetcher ahora es una función anónima aquí dentro
      const { data, error } = await supabase
        .from("profiles")
        .select("avatar_url, username")
        .eq("id", user!.id) // Usamos '!' porque sabemos que 'user' existe si la key no es null
        .single();

      if (error) {
        // No lanzamos un error para no romper toda la UI, solo lo logueamos
        console.error("Error fetching profile for sidebar:", error.message);
        return null;
      }
      return data;
    }
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/"); // Redirigimos al inicio después de cerrar sesión
    router.refresh();
  };

  const fallbackLetter =
    profile?.username?.charAt(0).toUpperCase() ||
    user?.email?.charAt(0).toUpperCase() ||
    "U";

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 h-screen bg-gray-900 text-white flex-col justify-between sticky top-0">
        <div className="p-6">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => (window.location.href = "/")}
            role="link"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && (window.location.href = "/")}
          >
            <Dumbbell className="h-8 w-8 text-purple-400" />
            <h1 className="text-2xl font-bold">GymTracker Pro</h1>
          </div>

          {/* Navigation Links */}
          <nav className="mt-10 flex flex-col space-y-4">
            <Link href="/routine">
              <Button variant="ghost" className="justify-start w-full">
                <ListTree className="w-5 h-5 mr-2" /> Rutinas
              </Button>
            </Link>
            <Link href="/progress">
              <Button variant="ghost" className="justify-start w-full">
                <BarChart className="w-5 h-5 mr-2" /> Progreso
              </Button>
            </Link>
            <Link href="/groups">
              <Button variant="ghost" className="justify-start w-full">
                <Users className="w-5 h-5 mr-2" /> Grupos
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" className="justify-start w-full">
                <LayoutDashboard className="w-5 h-5 mr-2" /> Dashboard
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" className="justify-start w-full">
                <User className="w-5 h-5 mr-2" /> Perfil
              </Button>
            </Link>
          </nav>
        </div>

        {/* Avatar and logout */}
        <div className="p-4 gap-6 flex">
          <Avatar className="w-40 h-20">
            <AvatarImage
              className="rounded-full size-20"
              src={profile?.avatar_url || undefined}
              alt="User Avatar"
            />
            <AvatarFallback>{fallbackLetter}</AvatarFallback>
          </Avatar>
          <div className="text-sm font-medium w-full text-center m-2">
            Hola, <span className="font-bold text-white">{user?.email}</span>
            <Button
              className="px-4 py-2 rounded hover:text-white hover:bg-red-500 w-full mt-2 bg-white text-black"
              onClick={handleLogout}
            >
              Cerrar sesión
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile navbar fixed bottom */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-700 flex justify-around items-center p-2 md:hidden">
        <Link href="/routine">
          <Button
            variant="ghost"
            size="icon"
            className="text-white flex flex-col items-center"
          >
            <ListTree className="w-5 h-5" />
            <span className="text-xs">Rutinas</span>
          </Button>
        </Link>
        <Link href="/progress">
          <Button
            variant="ghost"
            size="icon"
            className="text-white flex flex-col items-center"
          >
            <BarChart className="w-5 h-5" />
            <span className="text-xs">Progreso</span>
          </Button>
        </Link>{" "}
        <Link href="/groups">
          <Button
            variant="ghost"
            size="icon"
            className="text-white flex flex-col items-center"
          >
            <Users className="w-5 h-5" />
            <span className="text-xs">Grupos</span>
          </Button>
        </Link>{" "}
        <Link href="/dashboard">
          <Button
            variant="ghost"
            size="icon"
            className="text-white flex flex-col items-center"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-xs">Dashboard</span>
          </Button>
        </Link>{" "}
        <Link href="/profile">
          <Button
            variant="ghost"
            size="icon"
            className="text-white flex flex-col items-center"
          >
            <User className="w-5 h-5" />
            <span className="text-xs">Perfil</span>
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="text-red-400 hover:text-red-500 flex flex-col items-center"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-xs">Salir</span>
        </Button>
      </nav>
    </>
  );
}
