"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dumbbell } from "lucide-react";
// Ya no necesitamos useRouter aquí, usaremos <Link> directamente
// import { useRouter } from "next/navigation";

export default function NavbarGuest() {
  return (
    // El fondo de cristal y el sticky ya estaban perfectos. Añadimos transiciones.
    <header className="w-full border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* 1. MEJORA DE ACCESIBILIDAD: El logo ahora es un componente Link nativo. */}
        <Link
          href="/"
          className="flex items-center gap-3 text-white transition-opacity hover:opacity-80"
        >
          {/* 2. MEJORA DE ESTILO: El color del icono ahora es cian. */}
          <Dumbbell className="h-8 w-8 text-cyan-400" />
          {/* 3. MEJORA RESPONSIVE: El texto 'GymTracker Pro' se oculta en pantallas pequeñas ('sm' y menores). */}
          <h1 className="text-xl font-bold hidden sm:block">GymTracker Pro</h1>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="text-slate-200 hover:bg-slate-800 hover:text-white"
            asChild
          >
            <Link href="/auth/login">Iniciar Sesión</Link>
          </Button>

          {/* 4. MEJORA DE ESTILO: El botón principal ahora es cian. */}
          <Button
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold shadow-md hover:shadow-cyan-600/30 transition-all duration-300"
            asChild
          >
            {/* 5. MEJORA RESPONSIVE: El texto del botón cambia en móvil. */}
            <Link href="/auth/register">
              <span className="hidden sm:inline">Crear </span>Cuenta
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
