import { Badge } from "@/components/ui/badge";
import { UserAnswer } from "@/types/UserAnswer";
import { Clock } from "lucide-react";

export default function Availability({ answer }: { answer: UserAnswer }) {
  const getAvailabilityColor = (availability: string) => {
    const days = availability.split(" ")[0];
    const numDays = parseInt(days);
    if (numDays >= 5) return "bg-green-50 text-green-700 border-green-200";
    if (numDays >= 3) return "bg-yellow-50 text-yellow-700 border-yellow-200";
    return "bg-orange-50 text-orange-700 border-orange-200";
  };
  return (
    <div className="group relative">
<div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
<div className="relative bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300">
  <div className="flex items-center gap-3 mb-3">
    <div className="p-2 rounded-lg bg-green-100">
      <Clock className="h-5 w-5 text-green-600" />
    </div>
    <span className="font-semibold text-slate-700">
      Disponibilidad
    </span>
  </div>
  <Badge
    className={`${getAvailabilityColor(
      answer.availability
    )} hover:scale-105 transition-transform cursor-default`}
  >
    {answer.availability} Día
  </Badge>
      </div>
    </div>
  );
}