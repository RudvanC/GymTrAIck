"use client";

import Link from "next/link";
import {
  Dumbbell,
  BarChart,
  LayoutDashboard,
  LogOut,
  ListTree,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";

import { createClient } from "@/lib/supabase/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await createClient().auth.signOut();
    router.refresh();
  };

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
            <Link href="/dashboard">
              <Button variant="ghost" className="justify-start w-full">
                <LayoutDashboard className="w-5 h-5 mr-2" /> Dashboard
              </Button>
            </Link>
          </nav>
        </div>

        {/* Avatar and logout */}
        <div className="p-4 gap-6 flex">
          <Avatar className="w-30 h-20">
            <AvatarImage
              className="rounded-full size-20"
              src="https://github.com/shadcn.png"
              alt="User Avatar"
            />
            <AvatarFallback>GT</AvatarFallback>
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
        </Link>
        <Link href="/dashboard">
          <Button
            variant="ghost"
            size="icon"
            className="text-white flex flex-col items-center"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-xs">Dashboard</span>
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
