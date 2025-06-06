import { Badge } from "@/components/ui/badge";
import { UserAnswer } from "@/types/UserAnswer";
import { Shield } from "lucide-react";

export default function Injuries({ answer }: { answer: UserAnswer }) {
  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
      <div className="relative bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-red-100">
            <Shield className="h-5 w-5 text-red-600" />
          </div>
          <span className="font-semibold text-slate-700">
            Estado de lesiones
          </span>
        </div>
        <Badge
          className={`${
            answer.injuries
              ? "bg-red-50 text-red-700 border-red-200"
              : "bg-green-50 text-green-700 border-green-200"
          } hover:scale-105 transition-transform cursor-default`}
        >
          {answer.injuries || "Sin lesiones"}
        </Badge>
      </div>
    </div>
  );
}
