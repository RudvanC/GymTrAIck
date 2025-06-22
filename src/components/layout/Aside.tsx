"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Dumbbell,
  BarChart,
  LayoutDashboard,
  LogOut,
  ListTree,
  User,
  Users,
  Menu, // Icono para el menú
  X, // Icono para cerrar
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import useSWR from "swr";
import { useState } from "react"; // Importamos useState

const navLinks = [
  { href: "/routine", label: "Rutinas", icon: ListTree },
  { href: "/progress", label: "Progreso", icon: BarChart },
  { href: "/groups", label: "Grupos", icon: Users },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

// Dividimos los enlaces para la nueva estructura móvil
const mainNavLinks = [
  { href: "/routine", label: "Rutinas", icon: ListTree },
  { href: "/progress", label: "Progreso", icon: BarChart },
];

const secondaryNavLinks = [
  { href: "/groups", label: "Grupos", icon: Users },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/profile", label: "Perfil", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, supabase } = useAuth();
  const router = useRouter();

  // Estado para controlar el menú desplegable móvil
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // El estado 'isActive' ha sido eliminado

  const { data: profile } = useSWR(
    user ? `profile-${user.id}` : null,
    async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("avatar_url, username")
        .eq("id", user!.id)
        .single();
      if (error) {
        console.error("Error fetching profile for sidebar:", error.message);
        return null;
      }
      return data;
    }
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
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
          <Link href="/" className="flex items-center gap-2">
            <Dumbbell className="h-8 w-8 text-purple-400" />
            <h1 className="text-2xl font-bold">GymTracker Pro</h1>
          </Link>

          {/* Navigation Links (renderizados desde el array) */}
          <nav className="mt-10 flex flex-col space-y-2">
            {navLinks.map((link) => {
              // 3. Comprobamos si el enlace está activo
              const isActive = pathname.startsWith(link.href);

              return (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant="ghost"
                    // 4. Aplicamos clases condicionales
                    className={`
                      w-full justify-start text-base p-6
                      ${
                        isActive
                          ? "bg-white text-black hover:bg-gray-200"
                          : "hover:bg-gray-400"
                      }
                    `}
                  >
                    <link.icon className="w-5 h-5 mr-3" />
                    {link.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Avatar and logout (sin cambios) */}
        <div className="p-4 border-t border-gray-700 flex items-center gap-4">
          <Avatar>
            <AvatarImage
              className="rounded-full w-24 h-22"
              src={profile?.avatar_url || undefined}
              alt="User Avatar"
            />
            <AvatarFallback>{fallbackLetter}</AvatarFallback>
          </Avatar>
          <div className="text-sm flex flex-col w-full justify-center text-center gap-2">
            <p className="font-bold text-white truncate">
              <span className="font-normal">Hola, </span>
              {profile?.username || user?.email}
            </p>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="text-red-400 hover:text-red-500 flex items-center w-full"
            >
              <LogOut className="w-5 h-5" />

              <span className="text-xs">Salir</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile navbar fixed bottom */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-700 flex justify-around p-1 md:hidden">
        {/* Renderizamos los 3 enlaces principales */}
        {mainNavLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link key={link.href} href={link.href} className="flex-1">
              <Button
                variant="ghost"
                className={`flex flex-col h-14 w-full rounded-md text-xs ${
                  isActive ? "text-purple-400" : "text-gray-400"
                }`}
              >
                <link.icon className="w-5 h-5 mb-1" />
                {link.label}
              </Button>
            </Link>
          );
        })}

        {/* Botón "Menú" que abre el panel */}
        <Button
          variant="ghost"
          onClick={() => setIsMobileMenuOpen(true)}
          className="text-gray-400 flex flex-col flex-1 h-14 w-full rounded-md text-xs"
        >
          <Menu className="w-5 h-5 mb-1" />
          <span>Menú</span>
        </Button>
      </nav>

      {/* ===== PANEL DEL MENÚ MÓVIL (HAMBURGUESA) ===== */}
      {isMobileMenuOpen && (
        // Fondo oscuro semitransparente que cierra el menú al hacer clic
        <div
          className="fixed inset-0 bg-black/60 z-50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {/* Contenedor del panel que sube desde abajo */}
          <div
            className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 rounded-t-lg p-4"
            // Evita que hacer clic en el panel cierre el menú
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-white">Más Opciones</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="w-5 h-5 text-gray-400" />
              </Button>
            </div>

            {/* Lista de enlaces secundarios */}
            <div className="flex flex-col space-y-2">
              {secondaryNavLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-base p-4 ${
                        isActive
                          ? "bg-purple-600 text-white"
                          : "text-gray-300 hover:bg-gray-800"
                      }`}
                    >
                      <link.icon className="w-5 h-5 mr-3" />
                      {link.label}
                    </Button>
                  </Link>
                );
              })}
              {/* Botón de Salir */}
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start text-base p-4 text-red-400 hover:bg-red-500/20 hover:text-red-400"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
