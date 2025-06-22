/**
 * EditAnswer component.
 *
 * Provides an interactive modal form for editing a user's training profile,
 * including goal, experience, fitness level, availability, injuries, session duration,
 * and equipment access.
 *
 * The form supports form validation, state control, and a PATCH API call to persist changes.
 * After a successful update, it also triggers a regeneration of the user's training plan.
 *
 * @remarks
 * This component uses Tailwind CSS and Headless UI components for a responsive, accessible UI.
 * It shows a loading spinner during submission, and resets the form state after saving.
 *
 * @example
 * ```tsx
 * <EditAnswer currentAnswer={userAnswer} onUpdate={refetchUserAnswers} />
 * ```
 *
 * @param currentAnswer - The current `UserAnswer` data used to populate the form fields.
 * @param onUpdate - A callback triggered after a successful update and plan regeneration.
 *
 * @returns A button that opens a modal with the editable profile form.
 */

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

/**
 * Props for the `EditAnswer` component.
 */
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<UserAnswer>({
    ...currentAnswer,
    injuries: Array.isArray(currentAnswer.injuries)
      ? currentAnswer.injuries
      : [],
  });

  /**
   * Handles changes to standard input/select fields.
   *
   * @param field - The field name to update.
   * @param value - The new value for the field.
   */
  const handleChange = (field: keyof UserAnswer, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Handles checkbox input logic for injury selection.
   * Supports multi-select behavior and "none" exclusivity.
   *
   * @param injury - The injury option being toggled.
   * @param checked - Whether the checkbox is selected or not.
   */
  const handleInjuryChange = (injury: string, checked: boolean) => {
    setFormData((prev) => {
      let currentInjuries: Set<Injuries>;

      if (injury === "none") {
        currentInjuries = checked ? new Set(["none"]) : new Set();
      } else {
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

  /**
   * Handles form submission (placeholder - logic is delegated to `executeSaveAndRegenerate`).
   *
   * @param e - The form event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  };

  /**
   * Submits the updated form data via PATCH request and triggers regeneration of the training plan.
   * Handles loading state, error handling, and UI reset.
   */
  const executeSaveAndRegenerate = async () => {
    setIsSubmitting(true);
    setIsOpen(false);

    const finalInjuries =
      formData.injuries.length === 0 ? ["none"] : formData.injuries;

    const payloadToSubmit = { ...formData, injuries: finalInjuries };

    try {
      const updateResponse = await fetch(
        `/api/user-answers?id=${formData.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadToSubmit),
        }
      );

      if (!updateResponse.ok)
        throw new Error("Failed to save changes. Please try again.");

      const regenerateResponse = await fetch(
        `/api/regenerate-plan?answer_id=${formData.id}`,
        {
          method: "POST",
        }
      );

      if (!regenerateResponse.ok)
        throw new Error(
          "Profile was updated, but there was an error regenerating the plan."
        );

      alert("Profile updated successfully. Your new routines are on the way!");
      onUpdate();
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
        <Pencil className="mr-2 h-4 w-4" /> Editar respuestas
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-xl shadow-lg m-4">
            <form onSubmit={handleSubmit} className="p-6">
              {/* Form header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Editar respuestas</h2>
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

              {/* Form content */}
              <div className="max-h-[70vh] overflow-y-auto pr-4 space-y-6">
                {/* Goal and Experience */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Goal */}
                  <div className="space-y-2">
                    <Label htmlFor="goal" className="text-slate-300">
                      Objetivo principal
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

                  {/* Experience */}
                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-slate-300">
                      Experiencia de entrenamiento
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

                {/* Fitness Level and Availability */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fitness_level" className="text-slate-300">
                      Nivel de fitness
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

                  <div className="space-y-2">
                    <Label htmlFor="availability" className="text-slate-300">
                      Dias por semana
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
                </div>

                {/* Session Duration */}
                <div className="space-y-2">
                  <Label htmlFor="session_duration" className="text-slate-300">
                    Duración de la sesión
                  </Label>
                  <Select
                    value={formData.session_duration}
                    onValueChange={(value) =>
                      handleChange("session_duration", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {sessionDurationOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option.replace("min", " minutes")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Injuries */}
                <div className="space-y-3">
                  <Label className="text-base text-slate-300">
                    Lesiones (selecciona todas las que se aplican)
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

                {/* Equipment Access */}
                <div className="flex items-center justify-between rounded-lg border p-4 border-slate-700 bg-slate-900/50">
                  <div className="space-y-0.5">
                    <Label
                      htmlFor="equipment_access"
                      className="text-base text-slate-300"
                    >
                      ¿Tienes acceso a un gimnasio?
                    </Label>
                    <p className="text-sm text-slate-500">
                      Habilita si entrenas con equipo completo.
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

              {/* Actions */}
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
                  onClick={executeSaveAndRegenerate}
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-cyan-500 hover:bg-cyan-600"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Guardar cambios"
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
