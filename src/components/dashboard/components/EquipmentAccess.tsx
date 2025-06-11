import { Badge } from "@/components/ui/badge";
import { UserAnswer } from "@/types/UserAnswer";
import { CheckCircle2, Dumbbell, XCircle } from "lucide-react";

export default function EquipmentAccess({ answer }: { answer: UserAnswer }) {
  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
      <div className="relative bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-emerald-100">
            <Dumbbell className="h-5 w-5 text-emerald-600" />
          </div>
          <span className="font-semibold text-slate-700">Acceso a equipo</span>
        </div>
        <div className="flex items-center gap-2">
          {answer.equipment_access ? (
            <>
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <Badge className="bg-green-50 text-green-700 border-green-200 hover:scale-105 transition-transform cursor-default">
                Disponible
              </Badge>
            </>
          ) : (
            <>
              <XCircle className="h-5 w-5 text-red-600" />
              <Badge className="bg-red-50 text-red-700 border-red-200 hover:scale-105 transition-transform cursor-default">
                No disponible
              </Badge>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
