"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
} from "@/components/ui/menubar";
import { Dumbbell, LogOut } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "../ui/button";
import { createClient } from "@/lib/supabase/supabaseClient";

export default function Navbar() {
  const router = useRouter();
  const { user } = useAuth();

  const handleLogout = async () => {
    // Usamos el cliente de supabase para cerrar la sesión
    await createClient().auth.signOut();

    // ¡Paso clave! Refrescamos la ruta actual.
    // Esto le indica a Next.js que vuelva a ejecutar la lógica del servidor,
    // lo que actualizará la UI y protegerá las rutas si el usuario ya no tiene acceso.
    router.refresh();
  };

  return (
    <header className="w-full border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/")}
          role="link"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && router.push("/")}
        >
          <Dumbbell className="h-8 w-8 text-purple-400" />
          <h1 className="text-2xl font-bold text-white">GymTracker Pro</h1>
        </div>
        <div className="flex gap-4">
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger className="text-black">Dashboard</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  <Link href="/dashboard">Dashboard</Link>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="text-black">Routine</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  <Link href="/routine">Routine</Link>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="text-black">Progress</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  <Link href="/progress">Progress</Link>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-black bg-white hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            )}
          </Menubar>
        </div>
      </div>
    </header>
  );
}
