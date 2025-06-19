// src/app/dashboard/components/EditProfile.tsx

"use client";

import { useState } from "react";
import { Injuries, UserAnswer } from "@/types/UserAnswer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Pencil, X } from "lucide-react";
import {
  goalMap,
  fitnessLevelMap,
  trainingExperienceMap,
} from "@/lib/formatAnswer";

interface EditAnswerProps {
  currentAnswer: UserAnswer;
  onUpdate: () => void;
}

const injuryOptions = ["knee", "shoulder", "back", "ankle", "wrist", "none"];
const injuryMap: { [key: string]: string } = {
  knee: "Rodilla",
  shoulder: "Hombro",
  back: "Espalda",
  ankle: "Tobillo",
  wrist: "Muñeca",
  none: "Ninguna",
};
const sessionDurationOptions = [
  "15min",
  "30min",
  "45min",
  "60min",
  "90min",
  "120min",
];

export function EditAnswer({ currentAnswer, onUpdate }: EditAnswerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [formData, setFormData] = useState<UserAnswer>({
    ...currentAnswer,
    injuries: Array.isArray(currentAnswer.injuries)
      ? currentAnswer.injuries
      : [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof UserAnswer, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleInjuryChange = (injury: string, checked: boolean) => {
    setFormData((prev) => {
      let currentInjuries: Set<Injuries>;

      // Caso 1: El usuario interactúa con la opción "Ninguna"
      if (injury === "none") {
        // Si la marca, el array solo contendrá 'none'. Si la desmarca, el array se queda vacío.
        currentInjuries = checked ? new Set(["none"]) : new Set();
      }
      // Caso 2: El usuario interactúa con una lesión específica
      else {
        // Empezamos con las lesiones que ya tenía, pero quitamos 'none' si estaba.
        currentInjuries = new Set(prev.injuries.filter((i) => i !== "none"));
        if (checked) {
          currentInjuries.add(injury as Injuries);
        } else {
          currentInjuries.delete(injury as Injuries);
        }
      }

      return { ...prev, injuries: Array.from(currentInjuries) };
    });
  };

  // --- MEJORA: handleSubmit ahora es el único responsable y hace todo en orden ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const finalInjuries =
      formData.injuries.length === 0 ? ["none"] : formData.injuries;
    const payloadToSubmit = { ...formData, injuries: finalInjuries };

    try {
      // 1. PRIMERO, guardamos los cambios del perfil
      const updateResponse = await fetch(
        `/api/user-answers?id=${formData.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadToSubmit),
        }
      );

      if (!updateResponse.ok) {
        throw new Error("No se pudieron guardar los cambios en el perfil.");
      }

      // 2. DESPUÉS, si lo anterior fue bien, regeneramos el plan
      const regenerateResponse = await fetch(
        `/api/regenerate-plan?answer_id=${formData.id}`,
        {
          method: "POST",
        }
      );

      if (!regenerateResponse.ok) {
        throw new Error(
          "Perfil actualizado, pero hubo un error al regenerar las rutinas."
        );
      }

      // 3. FINALMENTE, si todo fue bien, avisamos y actualizamos la UI
      alert("¡Perfil actualizado! Se están generando tus nuevas rutinas.");
      onUpdate(); // Refresca los datos de la página sin recargar
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Pencil className="mr-2 h-4 w-4" /> Editar Perfil
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-xl shadow-lg m-4">
            <form onSubmit={handleSubmit} className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Editar Perfil</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isSubmitting}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="max-h-[70vh] overflow-y-auto pr-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Objetivo */}
                  <div className="space-y-2">
                    <Label htmlFor="goal" className="text-slate-300">
                      Objetivo Principal
                    </Label>
                    <Select
                      value={formData.goal}
                      onValueChange={(value) => handleChange("goal", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(goalMap).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Experiencia */}
                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-slate-300">
                      Experiencia
                    </Label>
                    <Select
                      value={formData.training_experience}
                      onValueChange={(value) =>
                        handleChange("training_experience", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(trainingExperienceMap).map(
                          ([key, value]) => (
                            <SelectItem key={key} value={key}>
                              {value}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nivel Físico */}
                  <div className="space-y-2">
                    <Label htmlFor="fitness_level" className="text-slate-300">
                      Nivel Físico
                    </Label>
                    <Select
                      value={formData.fitness_level}
                      onValueChange={(value) =>
                        handleChange("fitness_level", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(fitnessLevelMap).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* --- CAMPO AÑADIDO DE NUEVO --- */}
                  <div className="space-y-2">
                    <Label htmlFor="availability" className="text-slate-300">
                      Días por semana
                    </Label>
                    <Input
                      id="availability"
                      type="number"
                      min="1"
                      max="7"
                      value={formData.availability}
                      onChange={(e) =>
                        handleChange("availability", e.target.value)
                      }
                    />
                  </div>
                  {/* --- FIN DEL CAMPO AÑADIDO --- */}
                </div>

                {/* ... El resto del formulario (Duración, Lesiones, Equipo) no cambia ... */}
                <div className="space-y-2">
                  <Label htmlFor="session_duration" className="text-slate-300">
                    Duración por Sesión
                  </Label>
                  <Select
                    value={formData.session_duration}
                    onValueChange={(value) =>
                      handleChange("session_duration", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una duración" />
                    </SelectTrigger>
                    <SelectContent>
                      {sessionDurationOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option.replace("min", " minutos")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-base text-slate-300">
                    Lesiones (selecciona las que apliquen)
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-md border border-slate-700 bg-slate-900/50">
                    {injuryOptions.map((injuryKey) => (
                      <div
                        key={injuryKey}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={injuryKey}
                          checked={formData.injuries.includes(
                            injuryKey as Injuries
                          )}
                          onCheckedChange={(checked) =>
                            handleInjuryChange(injuryKey, !!checked)
                          }
                        />
                        <Label
                          htmlFor={injuryKey}
                          className="font-normal text-slate-300 cursor-pointer"
                        >
                          {injuryMap[injuryKey]}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4 border-slate-700 bg-slate-900/50">
                  <div className="space-y-0.5">
                    <Label
                      htmlFor="equipment_access"
                      className="text-base text-slate-300"
                    >
                      ¿Tienes acceso a un gimnasio?
                    </Label>
                    <p className="text-sm text-slate-500">
                      Actívalo si entrenas con equipamiento completo.
                    </p>
                  </div>
                  <Switch
                    id="equipment_access"
                    checked={formData.equipment_access}
                    onCheckedChange={(checked) =>
                      handleChange("equipment_access", checked)
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-slate-700 mt-6">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-cyan-500 hover:bg-cyan-600"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Guardar Cambios"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
