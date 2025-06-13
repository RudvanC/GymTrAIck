import { Badge } from "@/components/ui/badge";
import { UserAnswer } from "@/types/UserAnswer";
import { Dumbbell } from "lucide-react";
import { trainingExperienceMap } from "@/lib/formatAnswer";

export default function Experience({ answer }: { answer: UserAnswer }) {
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

  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
      <div className="relative bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-purple-100">
            <Dumbbell className="h-5 w-5 text-purple-600" />
          </div>
          <span className="font-semibold text-slate-700">Experiencia</span>
        </div>
        <Badge
          className={`${getExperienceColor(
            answer.training_experience
          )} hover:scale-105 transition-transform cursor-default`}
        >
          {trainingExperienceMap[answer.training_experience] ??
            "Experiencia desconocida"}
        </Badge>
      </div>
    </div>
  );
}
