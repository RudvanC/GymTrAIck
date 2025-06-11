import { Badge } from "@/components/ui/badge";
import { UserAnswer } from "@/types/UserAnswer";
import { Target } from "lucide-react";
import { goalMap } from "@/lib/formatAnswer";

export default function Goal({ answer }: { answer: UserAnswer }) {
  const getGoalColor = (goal: string) => {
    switch (goal.toLowerCase()) {
      case "muscle_gain":
        return "bg-green-50 text-green-700 border-green-200";
      case "fat_loss":
        return "bg-red-50 text-red-700 border-red-200";
      case "maintenance":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "general_health":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "strength_increase":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };
  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
      <div className="relative bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-blue-100">
            <Target className="h-5 w-5 text-blue-600" />
          </div>
          <span className="font-semibold text-slate-700">Objetivo</span>
        </div>
        <Badge
          className={`${getGoalColor(
            answer.goal
          )} hover:scale-105 transition-transform cursor-default`}
        >
          {goalMap[answer.goal] ?? "Objetivo desconocido"}
        </Badge>
      </div>
    </div>
  );
}
