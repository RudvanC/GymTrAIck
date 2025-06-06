import { Badge } from "@/components/ui/badge";
import { UserAnswer } from "@/types/UserAnswer";
import { Activity } from "lucide-react";
import { fitnessLevelMap } from "@/lib/formatAnswer";

export default function FitnessLevel({ answer }: { answer: UserAnswer }) {
  const getFitnessColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return "bg-red-50 text-red-700 border-red-200";
      case "intermediate":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "advanced":
        return "bg-green-50 text-green-700 border-green-200";
      case "athlete":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };
  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
      <div className="relative bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-orange-100">
            <Activity className="h-5 w-5 text-orange-600" />
          </div>
          <span className="font-semibold text-slate-700">Nivel físico</span>
        </div>
        <Badge
          className={`${getFitnessColor(
            answer.fitness_level
          )} hover:scale-105 transition-transform cursor-default`}
        >
          {fitnessLevelMap[answer.fitness_level] ?? "Nivel desconocido"}
        </Badge>
      </div>
    </div>
  );
}
