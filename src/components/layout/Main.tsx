import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dumbbell, TrendingUp, Calendar, Users } from "lucide-react";
import Link from "next/link";

export default function Main() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Application Navigation Bar */}
      <Navbar />

      {/* Hero Section: Main introductory content */}
      <section className="container mx-auto px-4 py-16 sm:py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Tu Rutina de Gimnasio
            <span className="text-purple-400"> Personalizada</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-8 leading-relaxed">
            Genera rutinas adaptadas a tu nivel, objetivos y disponibilidad.
            Lleva un seguimiento completo de tu progreso y alcanza tus metas
            fitness.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-3 shadow-lg hover:shadow-purple-700/50 transition-shadow duration-300"
              asChild
            >
              <Link href="/auth/register">Comenzar Gratis</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section: Highlights key benefits of the application */}
      <section className="container mx-auto px-4 py-16 sm:py-20">
        <h3 className="text-3xl sm:text-4xl font-bold text-center mb-12">
          ¿Por qué elegir GymTracker Pro?
        </h3>
        {/* Grid layout for feature cards, responsive columns */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature Card 1: Rutinas Personalizadas */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm shadow-lg hover:shadow-purple-500/20 transition-shadow duration-300">
            <CardHeader className="text-center">
              <Dumbbell className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <CardTitle className="text-white text-xl">
                Rutinas Personalizadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-center">
                Algoritmos inteligentes que crean rutinas basadas en tu
                experiencia, objetivos y tiempo disponible.
              </CardDescription>
            </CardContent>
          </Card>

          {/* Feature Card 2: Seguimiento de Progreso */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm shadow-lg hover:shadow-green-500/20 transition-shadow duration-300">
            <CardHeader className="text-center">
              <TrendingUp className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <CardTitle className="text-white text-xl">
                Seguimiento de Progreso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-center">
                Registra tus entrenamientos, pesos y medidas. Visualiza tu
                evolución con gráficos detallados.
              </CardDescription>
            </CardContent>
          </Card>

          {/* Feature Card 3: Planificación Inteligente */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm shadow-lg hover:shadow-blue-500/20 transition-shadow duration-300">
            <CardHeader className="text-center">
              <Calendar className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <CardTitle className="text-white text-xl">
                Planificación Inteligente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-center">
                Rutinas que se adaptan a tu horario y disponibilidad. Nunca más
                excusas para no entrenar.
              </CardDescription>
            </CardContent>
          </Card>

          {/* Feature Card 4: Para Todos los Niveles */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm shadow-lg hover:shadow-orange-500/20 transition-shadow duration-300">
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-orange-400 mx-auto mb-4" />
              <CardTitle className="text-white text-xl">
                Para Todos los Niveles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-center">
                Desde principiantes hasta avanzados. Rutinas que evolucionan
                contigo y respetan tus limitaciones.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action (CTA) Section: Encourages user sign-up */}
      <section className="container mx-auto px-4 py-16 sm:py-20">
        <Card className="bg-purple-600/20 border-purple-500/30 backdrop-blur-sm shadow-xl hover:shadow-purple-600/40 transition-shadow duration-300">
          <CardContent className="text-center py-10 sm:py-12">
            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              ¿Listo para transformar tu entrenamiento?
            </h3>
            <p className="text-gray-200 mb-8 text-lg sm:text-xl">
              Únete a miles de usuarios que ya están alcanzando sus objetivos
              fitness.
            </p>
            <Button
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-3 shadow-lg hover:shadow-purple-700/50 transition-shadow duration-300"
              asChild
            >
              <Link href="/auth/register">Crear Mi Rutina Ahora</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer Section */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm mt-10">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Dumbbell className="h-6 w-6 text-purple-400" />
            <span className="text-white font-semibold">GymTracker Pro</span>
          </div>
          {/* Copyright notice with dynamically updated year */}
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} GymTracker Pro. Todos los derechos
            reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
