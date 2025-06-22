"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // 1. Cambiamos la importación
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
import { useAuth } from "@/context/AuthContext";
import useSWR from "swr";

// Array con la configuración de los enlaces de navegación
const navLinks = [
  { href: "/routine", label: "Rutinas", icon: ListTree },
  { href: "/progress", label: "Progreso", icon: BarChart },
  { href: "/groups", label: "Grupos", icon: Users },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/profile", label: "Perfil", icon: User },
];

export default function Sidebar() {
  // 2. Obtenemos la ruta actual
  const pathname = usePathname();
  const { user, supabase } = useAuth();
  const router = useRouter();

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
        {navLinks.map((link) => {
          // La misma lógica de comprobación
          const isActive = pathname.startsWith(link.href);

          return (
            <Link key={link.href} href={link.href}>
              <Button
                variant="ghost"
                size="icon"
                // La misma lógica de clases condicionales
                className={`
                  flex flex-col h-14 w-16 rounded-md
                  ${isActive ? "text-purple-400" : "text-gray-400"}
                `}
              >
                <link.icon className="w-5 h-5" />
                <span className="text-xs mt-1">{link.label}</span>
              </Button>
            </Link>
          );
        })}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="text-red-400 hover:text-red-500 flex flex-col items-center h-full align-self-center"
        >
          <LogOut className="w-5 h-5" />

          <span className="text-xs">Salir</span>
        </Button>
      </nav>
    </>
  );
}
