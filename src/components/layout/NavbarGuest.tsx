"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dumbbell } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NavbarGuest() {
  const router = useRouter();

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
        <div className="flex gap-2">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 hover:text-white"
            asChild
          >
            <Link href="/auth/login">Iniciar Sesión</Link>
          </Button>
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold"
            asChild
          >
            <Link href="/auth/register">Registrarse</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
