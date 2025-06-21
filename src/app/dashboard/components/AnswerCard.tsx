/**
 * Renders the visual card component that summarizes the user's current training preferences.
 *
 * Used on the dashboard page to display key details from the user's latest answer,
 * including goals, fitness level, experience, availability, and more.
 *
 * @remarks
 * The card is built using UI components like `Card`, `Badge`, and `Separator`, with icons from Lucide.
 * Visual effects include gradients, blur, and hover transitions. Dynamic colors are applied to badges
 * based on the type and value of each item.
 *
 * @example
 * ```tsx
 * <AnswerCard answer={userAnswer} />
 * ```
 *
 * @param answer - The user’s most recent answer object.
 * @returns A styled summary card with structured training profile information.
 */

import { UserAnswer } from "@/types/UserAnswer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dumbbell,
  Target,
  Activity,
  Timer,
  CalendarDays,
  Gauge,
  HeartPulse,
  Bell,
} from "lucide-react";
import {
  goalMap,
  fitnessLevelMap,
  trainingExperienceMap,
  formatInjuries,
  formatSessionDuration,
} from "@/lib/formatAnswer";

const iconMap = {
  Target,
  Bell,
  Gauge,
  CalendarDays,
  Timer,
  HeartPulse,
  Dumbbell,
  Activity,
};
type IconName = keyof typeof iconMap;

/**
 * Determines the dynamic badge style (color classes) based on the data type and value.
 *
 * @param type - The type of user data (e.g. 'experience', 'fitness', 'injuries').
 * @param value - The textual value of the data.
 * @returns A string with Tailwind CSS classes applied to the badge.
 */
const getBadgeStyle = (type: string, value: string): string => {
  const baseStyle =
    "border text-base font-semibold transition-all duration-300 hover:scale-105 cursor-default text-center w-full";

  switch (type) {
    case "experience":
      if (value.toLowerCase().includes("principiante"))
        return `${baseStyle} bg-green-900/50 text-green-300 border-green-700/50`;
      if (value.toLowerCase().includes("intermedio"))
        return `${baseStyle} bg-blue-900/50 text-blue-300 border-blue-700/50`;
      if (value.toLowerCase().includes("avanzado"))
        return `${baseStyle} bg-purple-900/50 text-purple-300 border-purple-700/50`;
      break;
    case "fitness":
      if (value.toLowerCase().includes("bajo"))
        return `${baseStyle} bg-amber-900/50 text-amber-300 border-amber-700/50`;
      if (value.toLowerCase().includes("medio"))
        return `${baseStyle} bg-sky-900/50 text-sky-300 border-sky-700/50`;
      if (value.toLowerCase().includes("alto"))
        return `${baseStyle} bg-emerald-900/50 text-emerald-300 border-emerald-700/50`;
      break;
    case "injuries":
      if (value.toLowerCase() !== "sin lesiones")
        return `${baseStyle} bg-red-900/50 text-red-300 border-red-700/50`;
      return `${baseStyle} bg-green-900/50 text-green-300 border-green-700/50`;
  }

  return `${baseStyle} bg-slate-700/50 text-slate-300 border-slate-600/50`; // default style
};

/**
 * Renders a stylized information block showing a title, icon, and a badge value.
 *
 * @param icon - The name of the icon to render.
 * @param title - The label displayed above the badge.
 * @param value - The value shown inside the badge.
 * @param colorClass - Tailwind gradient classes for background glow effect.
 * @param type - The type of value, used to determine badge color dynamically.
 *
 * @returns A styled info card block as a React element.
 */
const InfoBlock = ({
  icon,
  title,
  value,
  colorClass,
  type,
}: {
  icon: IconName;
  title: string;
  value: string;
  colorClass: string;
  type: string;
}) => {
  const IconComponent = iconMap[icon];
  return (
    <div className="relative group h-full">
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r ${colorClass} rounded-xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-300`}
      />
      <div className="relative bg-slate-900/70 backdrop-blur-sm rounded-xl p-4 border border-slate-800 hover:border-slate-700 transition-all duration-300 h-full">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-slate-800">
            <IconComponent className="h-5 w-5 text-slate-400" />
          </div>
          <span className="font-semibold text-slate-300">{title}</span>
        </div>
        <Badge className={getBadgeStyle(type, value)}>{value}</Badge>
      </div>
    </div>
  );
};

/**
 * `AnswerCard` is a dashboard UI component that summarizes key attributes from a user's profile.
 *
 * Each field (goal, experience, fitness level, availability, etc.) is represented visually with
 * an icon, title, and dynamically styled badge.
 *
 * @param answer - The user's latest `UserAnswer` object.
 * @returns A React component showing a full training profile card.
 */
export function AnswerCard({ answer }: { answer: UserAnswer }) {
  const profileData = [
    {
      type: "goal",
      icon: "Target" as IconName,
      title: "Objetivo",
      value: goalMap[answer.goal] || answer.goal,
      color: "from-blue-500 to-cyan-500",
    },
    {
      type: "experience",
      icon: "Activity" as IconName,
      title: "Experiencia",
      value:
        trainingExperienceMap[answer.training_experience] ||
        answer.training_experience,
      color: "from-purple-500 to-blue-500",
    },
    {
      type: "fitness",
      icon: "Gauge" as IconName,
      title: "Nivel Físico",
      value: fitnessLevelMap[answer.fitness_level] || answer.fitness_level,
      color: "from-orange-500 to-red-500",
    },
    {
      type: "availability",
      icon: "CalendarDays" as IconName,
      title: "Disponibilidad",
      value: `${answer.availability} días/semana`,
      color: "from-green-500 to-emerald-500",
    },
    {
      type: "duration",
      icon: "Timer" as IconName,
      title: "Duración Sesión",
      value: formatSessionDuration(answer.session_duration),
      color: "from-indigo-500 to-purple-500",
    },
    {
      type: "injuries",
      icon: "HeartPulse" as IconName,
      title: "Lesiones",
      value: formatInjuries(answer.injuries),
      color: "from-red-500 to-pink-500",
    },
    {
      type: "equipment",
      icon: "Dumbbell" as IconName,
      title: "Acceso a Equipo",
      value: answer.equipment_access ? "Gimnasio" : "En casa",
      color: "from-emerald-500 to-teal-500",
    },
  ];

  return (
    <Card className="w-full mb-4 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 shadow-2xl rounded-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-3xl font-bold text-white">
          <Activity className="h-8 w-8 text-cyan-400" />
          Tu Perfil de Entrenamiento
        </CardTitle>
        <p className="text-slate-400">
          Este es el resumen de tus preferencias actuales.
        </p>
        <Separator className="mt-2 bg-slate-700/50" />
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap justify-center gap-12">
          {profileData.map((item) => (
            <InfoBlock
              key={item.title}
              icon={item.icon}
              title={item.title}
              value={item.value}
              colorClass={item.color}
              type={item.type}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
