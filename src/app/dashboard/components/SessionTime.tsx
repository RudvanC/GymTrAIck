import { Badge } from "@/components/ui/badge";
import { UserAnswer } from "@/types/UserAnswer";
import { Timer } from "lucide-react";
import { formatSessionDuration } from "@/lib/formatAnswer";

export default function SessionTime({ answer }: { answer: UserAnswer }) {
  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
      <div className="relative bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-indigo-100">
            <Timer className="h-5 w-5 text-indigo-600" />
          </div>
          <span className="font-semibold text-slate-700">Duración sesión</span>
        </div>
        <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 hover:scale-105 transition-transform cursor-default">
          {formatSessionDuration(answer.session_duration)}
        </Badge>
      </div>
    </div>
  );
}
