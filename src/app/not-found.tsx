"use client";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

const NotFound = () => {
  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:");
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] flex items-center justify-center px-4">
      <div className="text-center max-w-lg mx-auto">
        {/* 404 Number */}
        <div className="relative mb-8">
          <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-purple-600 select-none">
            404
          </h1>
          <div className="absolute inset-0 text-8xl md:text-9xl font-bold text-purple-500/20 blur-sm select-none">
            404
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Página No Encontrada
          </h2>
          <p className="text-gray-300 text-lg mb-2">
            Lo sentimos, la página que buscas no existe.
          </p>
          <p className="text-gray-400 text-sm">
            La URL <span className="text-purple-400 font-mono"></span> no está
            disponible.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
          >
            <Home size={20} />
            Ir al Inicio
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 border border-purple-500/50 text-purple-300 hover:text-white hover:border-purple-400 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-purple-500/10"
          >
            <ArrowLeft size={20} />
            Volver Atrás
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="mt-12 flex justify-center space-x-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse delay-75"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-150"></div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default NotFound;
