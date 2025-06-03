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

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-white mb-6">
            Tu Rutina de Gimnasio
            <span className="text-purple-400"> Personalizada</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Genera rutinas adaptadas a tu nivel, objetivos y disponibilidad.
            Lleva un seguimiento completo de tu progreso y alcanza tus metas
            fitness.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-3"
              asChild
            >
              <Link href="/auth/register">Comenzar Gratis</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h3 className="text-3xl font-bold text-white text-center mb-12">
          ¿Por qué elegir GymTracker Pro?
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader className="text-center">
              <Dumbbell className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <CardTitle className="text-white">
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

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader className="text-center">
              <TrendingUp className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <CardTitle className="text-white">
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

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader className="text-center">
              <Calendar className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <CardTitle className="text-white">
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

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-orange-400 mx-auto mb-4" />
              <CardTitle className="text-white">
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

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-purple-500/20 border-purple-500/30 backdrop-blur-sm">
          <CardContent className="text-center py-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              ¿Listo para transformar tu entrenamiento?
            </h3>
            <p className="text-gray-300 mb-8 text-lg">
              Únete a miles de usuarios que ya están alcanzando sus objetivos
              fitness
            </p>
            <Button
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-3"
              asChild
            >
              <Link href="/auth/register">Crear Mi Rutina Ahora</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Dumbbell className="h-6 w-6 text-purple-400" />
            <span className="text-white font-semibold">GymTracker Pro</span>
          </div>
          <p className="text-gray-400">
            © 2025 GymTracker Pro. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
