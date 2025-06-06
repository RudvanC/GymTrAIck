import { UserAnswer } from "@/types/UserAnswer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dumbbell,
  Clock,
  Heart,
  Target,
  Activity,
  Timer,
  Shield,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Experience from "@/components/dashboard/components/Experience";
import Availability from "@/components/dashboard/components/Availability";
import FitnessLevel from "@/components/dashboard/components/FitnessLevel";
import Goal from "@/components/dashboard/components/Goal";
import SessionTime from "@/components/dashboard/components/SessionTime";
import Injuries from "@/components/dashboard/components/Injuries";
import EquipmentAccess from "@/components/dashboard/components/EquipmentAccess";

export function AnswerCard({ answer }: { answer: UserAnswer }) {
  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "experience":
        return "default";
      case "availability":
        return "secondary";
      case "injuries":
        return "destructive";
      case "equipment":
        return "outline";
      case "goal":
        return "default";
      case "fitness":
        return "secondary";
      case "duration":
        return "outline";
      default:
        return "default";
    }
  };

  const getExperienceColor = (experience: string) => {
    switch (experience.toLowerCase()) {
      case "principiante":
        return "bg-green-50 text-green-700 border-green-200";
      case "intermedio":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "avanzado":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getAvailabilityColor = (availability: string) => {
    const days = availability.split(" ")[0];
    const numDays = parseInt(days);
    if (numDays >= 5) return "bg-green-50 text-green-700 border-green-200";
    if (numDays >= 3) return "bg-yellow-50 text-yellow-700 border-yellow-200";
    return "bg-orange-50 text-orange-700 border-orange-200";
  };

  const getFitnessColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "bajo":
        return "bg-red-50 text-red-700 border-red-200";
      case "medio":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "alto":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-slate-50 to-slate-100 border-0 shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          <Activity className="h-8 w-8 text-purple-600" />
          Perfil de Entrenamiento
        </CardTitle>
        <Separator className="bg-gradient-to-r from-purple-200 to-blue-200" />
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Primera fila - Información básica */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Experiencia */}
          <Experience answer={answer} />

          {/* Disponibilidad */}
          <Availability answer={answer} />

          {/* Nivel físico */}
          <FitnessLevel answer={answer} />
        </div>

        {/* Segunda fila - Objetivos y preferencias */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Objetivo */}
          <Goal answer={answer} />
          {/* Duración de sesión */}
          <SessionTime answer={answer} />
        </div>

        {/* Tercera fila - Estado y equipamiento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Lesiones */}
          <Injuries answer={answer} />

          {/* Acceso a equipo */}
          <EquipmentAccess answer={answer} />
        </div>
      </CardContent>
    </Card>
  );
}
