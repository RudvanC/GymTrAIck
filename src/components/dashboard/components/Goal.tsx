import { Badge } from "@/components/ui/badge";
import { UserAnswer } from "@/types/UserAnswer";
import { Target } from "lucide-react";

export default function Goal({ answer }: { answer: UserAnswer }) {
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
        <Badge className="bg-blue-50 text-blue-700 border-blue-200 hover:scale-105 transition-transform cursor-default">
          {answer.goal}
        </Badge>
      </div>
    </div>
  );
}
