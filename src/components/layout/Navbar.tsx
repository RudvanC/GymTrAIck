// src/components/Navbar.tsx

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dumbbell } from "lucide-react";

export default function Navbar() {
  return (
    <>
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-8 w-8 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">GymTracker Pro</h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10"
              asChild
            >
              <Link href="/auth/login">Iniciar Sesión</Link>
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700" asChild>
              <Link href="/auth/register">Registrarse</Link>
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}
