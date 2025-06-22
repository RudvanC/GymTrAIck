import Navbar from "@/components/layout/NavbarGuest";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dumbbell,
  TrendingUp,
  Calendar,
  Users,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import React from "react";

// --- DATOS PARA LAS TARJETAS DE CARACTERÍSTICAS (CON EL NUEVO COLOR UNIFICADO) ---
const featureData = [
  {
    icon: Dumbbell,
    title: "Rutinas Personalizadas",
    description:
      "Algoritmos inteligentes que crean rutinas basadas en tu experiencia, objetivos y tiempo disponible.",
  },
  {
    icon: TrendingUp,
    title: "Seguimiento de Progreso",
    description:
      "Registra tus entrenamientos, pesos y medidas. Visualiza tu evolución con gráficos detallados.",
  },
  {
    icon: Calendar,
    title: "Planificación Inteligente",
    description:
      "Rutinas que se adaptan a tu horario y disponibilidad. Nunca más excusas para no entrenar.",
  },
  {
    icon: Users,
    title: "Para Todos los Niveles",
    description:
      "Desde principiantes hasta avanzados. Rutinas que evolucionan contigo y respetan tus limitaciones.",
  },
];

// --- COMPONENTES DE SECCIÓN REFACTORIZADOS ---

const FeatureCard = ({
  icon: Icon,
  title,
  description,
}: (typeof featureData)[0]) => (
  // Ahora todas las tarjetas usan el mismo estilo de hover y color de icono
  <Card className="bg-slate-900/40 border-slate-800/50 backdrop-blur-sm shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 hover:-translate-y-1 h-full">
    <CardHeader className="text-center">
      <div className="mx-auto mb-4 bg-slate-900/60 p-3 rounded-full border border-slate-700">
        <Icon className="h-8 w-8 text-cyan-400" />
      </div>
      <CardTitle className="text-white text-xl">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-slate-400 text-center text-sm">{description}</p>
    </CardContent>
  </Card>
);

const HeroSection = () => (
  <section className="container mx-auto px-4 py-20 text-center sm:py-24">
    <div className="max-w-4xl mx-auto">
      <h1
        className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400 animate-fade-in-up"
        style={{ animationDelay: "0.2s", animationFillMode: "backwards" }}
      >
        Tu Rutina de Gimnasio{" "}
        <span className="text-cyan-400">Personalizada</span>{" "}
        {/* Cambio a cian */}
      </h1>
      <p
        className="text-lg sm:text-xl text-slate-300 mb-8 leading-relaxed animate-fade-in-up"
        style={{ animationDelay: "0.4s", animationFillMode: "backwards" }}
      >
        Genera rutinas adaptadas a tu nivel, objetivos y disponibilidad. Lleva
        un seguimiento completo de tu progreso y alcanza tus metas fitness.
      </p>
      <div
        className="flex gap-4 justify-center flex-wrap animate-fade-in-up"
        style={{ animationDelay: "0.6s", animationFillMode: "backwards" }}
      >
        {/* El botón principal ahora es cian */}
        <Button
          size="lg"
          className="bg-cyan-600 hover:bg-cyan-700 text-white text-lg px-8 py-6 shadow-lg hover:shadow-cyan-700/50 transition-all duration-300 hover:scale-105"
          asChild
        >
          <Link href="/auth/register">Comenzar Gratis</Link>
        </Button>
      </div>
    </div>
  </section>
);

const FeaturesSection = () => (
  <section className="container mx-auto px-4 py-16 sm:py-20">
    <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-white">
      ¿Por qué elegir GymTracker Pro?
    </h2>
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {featureData.map((feature, index) => (
        <div
          key={feature.title}
          className="animate-fade-in-up"
          style={{
            animationDelay: `${0.2 * (index + 1)}s`,
            animationFillMode: "backwards",
          }}
        >
          <FeatureCard {...feature} />
        </div>
      ))}
    </div>
  </section>
);

const CtaSection = () => (
  <section className="container mx-auto px-4 py-16 sm:py-20">
    {/* La tarjeta CTA ahora usa el estilo de "panel de cristal" estándar */}
    <Card className="bg-slate-900/40 border-slate-800/50 backdrop-blur-sm shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 hover:-translate-y-1 rounded-2xl">
      <CardContent className="text-center p-10 sm:p-12">
        <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          ¿Listo para transformar tu entrenamiento?
        </h3>
        <p className="text-slate-300 mb-8 text-lg sm:text-xl">
          Únete a miles de usuarios que ya están alcanzando sus objetivos.
        </p>
        <Button
          size="lg"
          className="bg-cyan-600 hover:bg-cyan-700 text-white text-lg px-8 py-6 shadow-lg hover:shadow-cyan-700/50 transition-all duration-300 hover:scale-105"
          asChild
        >
          <Link href="/auth/register">
            Crear Mi Rutina Ahora <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  </section>
);

const PageFooter = () => (
  <footer className="border-t border-white/10 mt-10">
    <div className="container mx-auto px-4 py-8 text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Dumbbell className="h-6 w-6 text-cyan-400" /> {/* Cambio a cian */}
        <span className="text-white font-semibold">GymTracker Pro</span>
      </div>
      <p className="text-slate-400 text-sm">
        © {new Date().getFullYear()} GymTracker Pro. Todos los derechos
        reservados.
      </p>
    </div>
  </footer>
);

// --- El Componente Principal de la Página ---
export default function HomePage() {
  return (
    // Mantenemos el fondo con gradiente radial que te gustó
    <div className="bg-slate-950 text-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <CtaSection />
      </main>
      <PageFooter />
    </div>
  );
}
