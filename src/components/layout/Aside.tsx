"use client";

import Link from "next/link";
import { Dumbbell, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/supabaseClient";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    // Usamos el cliente de supabase para cerrar la sesión
    await createClient().auth.signOut();

    // ¡Paso clave! Refrescamos la ruta actual.
    // Esto le indica a Next.js que vuelva a ejecutar la lógica del servidor,
    // lo que actualizará la UI y protegerá las rutas si el usuario ya no tiene acceso.
    router.refresh();
  };

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white flex flex-col justify-between sticky top-0">
      {/* Logo Section */}
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
          <Link href="/dashboard">
            <Button className="px-4 py-2 rounded hover:bg-gray-700 w-full">
              Dashboard
            </Button>
          </Link>
          <Link href="/routine">
            <Button className="px-4 py-2 rounded hover:bg-gray-700 w-full">
              Routine
            </Button>
          </Link>
          <Link href="/progress">
            <Button className="px-4 py-2 rounded hover:bg-gray-700 w-full">
              Progress
            </Button>
          </Link>
        </nav>
      </div>

      {/* User Avatar Section */}
      <div className="p-6 gap-6">
        <Avatar className="w-12 h-12">
          <AvatarImage
            className="rounded-full"
            src="https://github.com/shadcn.png"
            alt="User Avatar"
          />
          <AvatarFallback>GT</AvatarFallback>
        </Avatar>
        {user && (
          <>
            <Button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 mt-2 px-4 py-4 text-sm font-medium text-black bg-white hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </>
        )}
      </div>
    </aside>
  );
}
