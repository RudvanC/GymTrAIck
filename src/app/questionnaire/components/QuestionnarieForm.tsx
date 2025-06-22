/**
 * QuestionnaireForm Component
 *
 * A guided form that collects user input to generate a personalized workout plan.
 * It uses controlled components, local state, validation, and Supabase integration.
 *
 * @remarks
 * - Includes questions about experience, availability, injuries, goals, equipment, and more.
 * - Upon successful submission, redirects to `/routine` after a short delay.
 */

"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Activity,
  ArrowRight,
  BarChart,
  CalendarDays,
  Dumbbell,
  Gauge,
  HeartPulse,
  Loader2,
  ShieldCheck,
  Sparkles,
  Target,
  Timer,
  UserIcon,
} from "lucide-react";
import { Checkbox } from "@radix-ui/react-checkbox";
import SelectionCard from "./SelectionCard";
import { Injuries } from "@/types/UserAnswer";

const injuriesOptions = [
  { value: "none", label: "Ninguna" },
  { value: "knee", label: "Rodilla" },
  { value: "shoulder", label: "Hombro" },
  { value: "back", label: "Espalda" },
  { value: "ankle", label: "Tobillo" },
  { value: "wrist", label: "Muñeca" },
];

const sessionDurationOptions = [
  { value: "15min", label: "15 minutos" },
  { value: "30min", label: "30 minutos" },
  { value: "45min", label: "45 minutos" },
  { value: "60min", label: "1 hora" },
  { value: "90min", label: "1 hora y media" },
  { value: "120min", label: "2 horas" },
];

export default function QuestionnaireForm() {
  const router = useRouter();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    training_experience: "",
    availability: "",
    injuries: [] as string[],
    equipment_access: false,
    goal: "",
    fitness_level: "",
    session_duration: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => router.push("/routine"), 2500);
      return () => clearTimeout(timer);
    }
  }, [success, router]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value, checked, type } = e.target as HTMLInputElement;

    if (name === "injuries") {
      let newInjuries = [...formData.injuries];
      if (value === "none") {
        newInjuries = checked ? ["none"] : [];
      } else {
        if (checked) {
          newInjuries = newInjuries.filter((inj) => inj !== "none");
          if (!newInjuries.includes(value)) newInjuries.push(value);
        } else {
          newInjuries = newInjuries.filter((inj) => inj !== value);
        }
      }
      setFormData((prev) => ({ ...prev, injuries: newInjuries }));
    } else if (type === "checkbox") {
      // En caso de checkbox que no sea lesiones (aunque no tienes otros)
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }

  function handleSelectChange(name: string, value: string | boolean) {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }
  interface FormData {
    training_experience: string;
    availability: string;
    injuries: string[];
    equipment_access: boolean;
    goal: string;
    fitness_level: string;
    session_duration: string;
    user_id: string;
  }

  async function submitAnswers(payload: FormData) {
    const response = await fetch("/api/user-answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al guardar las respuestas");
    }

    return response.json();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    if (!user?.id) {
      setError(
        "Usuario no autenticado. Por favor, recarga la página o inicia sesión de nuevo."
      );
      setLoading(false);
      return;
    }

    const {
      training_experience,
      availability,
      goal,
      fitness_level,
      session_duration,
    } = formData;

    if (
      !training_experience ||
      !availability ||
      !goal ||
      !fitness_level ||
      !session_duration
    ) {
      setError("Por favor, completa todos los campos obligatorios.");
      setLoading(false);
      return;
    }

    const availabilityNum = parseInt(availability, 10);
    if (isNaN(availabilityNum) || availabilityNum < 1 || availabilityNum > 7) {
      setError("Los días de disponibilidad deben estar entre 1 y 7.");
      setLoading(false);
      return;
    }

    try {
      await submitAnswers({
        ...formData,
        user_id: user.id,
        availability: availabilityNum.toString(),
      });
      setSuccess(true);
      setFormData({
        training_experience: "",
        availability: "",
        injuries: [],
        equipment_access: false,
        goal: "",
        fitness_level: "",
        session_duration: "",
      });
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al guardar las respuestas. Inténtalo de nuevo."
      );
    } finally {
      setLoading(false);
    }
  }

  const handleInjuryChange = (injuryValue: string, isChecked: boolean) => {
    setFormData((prev) => {
      // Usamos un Set para manejar fácilmente el añadir/quitar elementos
      let currentInjuries = new Set(prev.injuries);

      // CASO 1: El usuario hace clic en "Ninguna"
      if (injuryValue === "none") {
        // Si la marca, la lista solo debe contener 'none'.
        // Si la desmarca, la lista debe quedar vacía (y luego la regla final la rellenará).
        currentInjuries = isChecked ? new Set(["none"]) : new Set();

        // CASO 2: El usuario hace clic en una lesión específica
      } else {
        // Si va a marcar una lesión, primero nos aseguramos de quitar "Ninguna" de la lista.
        currentInjuries.delete("none");

        if (isChecked) {
          currentInjuries.add(injuryValue as Injuries);
        } else {
          currentInjuries.delete(injuryValue as Injuries);
        }
      }

      // REGLA FINAL: Si después de todas las operaciones la lista ha quedado vacía,
      // forzamos que "Ninguna" sea la opción seleccionada.
      if (currentInjuries.size === 0) {
        currentInjuries.add("none");
      }

      return { ...prev, injuries: Array.from(currentInjuries) };
    });
  };

  return (
    <div className="bg-slate-950 p-4 sm:p-6 flex items-center justify-center">
      <Card className="w-full max-w-2xl bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 shadow-2xl rounded-2xl">
        <form onSubmit={handleSubmit}>
          {/* MEJORA VISUAL: Cabecera más impactante */}
          <CardHeader className="text-center p-6 sm:p-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Crea Tu Plan Perfecto
            </CardTitle>
            <CardDescription className="text-slate-400 pt-1">
              Tus respuestas nos ayudarán a generar el plan ideal para ti.
            </CardDescription>
          </CardHeader>

          {/* MEJORA VISUAL: Contenido con más espaciado y estructura */}
          <CardContent className="space-y-8 p-6 sm:p-8">
            {/* Pregunta 1: Experiencia */}
            <div className="space-y-3">
              <Label
                htmlFor="training_experience"
                className="flex items-center gap-2 text-lg font-semibold text-white"
              >
                <Activity size={20} className="text-cyan-400" />
                ¿Tu experiencia entrenando?
              </Label>
              <Select
                name="training_experience"
                onValueChange={(value) =>
                  handleSelectChange("training_experience", value)
                }
                value={formData.training_experience}
              >
                <SelectTrigger
                  id="training_experience"
                  className="bg-slate-800 text-white border-slate-700 h-12 text-base w-full"
                >
                  <SelectValue placeholder="Selecciona tu experiencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nunca entrené</SelectItem>
                  <SelectItem value="little">Menos de 6 meses</SelectItem>
                  <SelectItem value="moderate">6 meses - 2 años</SelectItem>
                  <SelectItem value="advanced">Más de 2 años</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Pregunta 2: Disponibilidad */}
            <div className="space-y-3">
              <Label
                htmlFor="availability"
                className="flex items-center gap-2 text-lg font-semibold text-white"
              >
                <CalendarDays size={20} className="text-cyan-400" />
                ¿Cuántos días por semana?
              </Label>
              <Input
                id="availability"
                type="number"
                name="availability"
                placeholder="Ej: 3"
                min={1}
                max={7}
                value={formData.availability}
                onChange={handleChange}
                required
                className="bg-slate-800 text-white border-slate-700 h-12 text-base"
              />
            </div>

            {/* Pregunta 3: Lesiones */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-lg font-semibold text-white">
                <HeartPulse size={20} className="text-cyan-400" />
                ¿Alguna lesión a considerar?
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2 bg-slate-800/50 border border-slate-700 rounded-lg">
                {injuriesOptions.map((inj) => {
                  // Comprobamos si la opción actual está seleccionada para aplicar los estilos
                  const isSelected = formData.injuries.includes(inj.value);

                  return (
                    // MEJORA: Hacemos que toda la fila sea clickable y cambie de color
                    <Label
                      key={inj.value}
                      htmlFor={inj.value}
                      className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer transition-colors duration-200 ${
                        isSelected
                          ? "bg-cyan-900/50 text-cyan-300"
                          : "text-slate-400 hover:bg-slate-700/50"
                      }`}
                    >
                      <Checkbox
                        id={inj.value}
                        checked={isSelected}
                        // MEJORA: Llamamos a nuestra nueva función, que es más limpia
                        onCheckedChange={(checked) => {
                          handleInjuryChange(inj.value, !!checked);
                        }}
                        // MEJORA: Clases para que el checkbox también coja el color de acento
                        className="border-slate-500 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-400"
                      />
                      <span className="font-medium">{inj.label}</span>
                    </Label>
                  );
                })}
              </div>
              <p className="text-xs text-slate-500 px-1">
                Si no tienes lesiones, simplemente no selecciones ninguna.
              </p>
            </div>

            {/* Pregunta 4: Acceso a Equipamiento */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-lg font-semibold text-white">
                <Dumbbell size={20} className="text-cyan-400" />
                ¿Tienes acceso a equipamiento?
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectionCard
                  icon={<Dumbbell size={24} />}
                  title="Sí, gimnasio completo"
                  description="Entreno con pesas, máquinas, etc."
                  isSelected={formData.equipment_access === true}
                  onClick={() => handleSelectChange("equipment_access", true)}
                />
                <SelectionCard
                  icon={<UserIcon size={24} />}
                  title="No, en casa"
                  description="Entreno con peso corporal o poco equipo."
                  isSelected={formData.equipment_access === false}
                  onClick={() => handleSelectChange("equipment_access", false)}
                />
              </div>
            </div>

            {/* --- Pregunta: Objetivo Principal --- */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-lg font-semibold text-white">
                <Target size={20} className="text-cyan-400" />
                ¿Cuál es tu objetivo principal?
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectionCard
                  icon={<Dumbbell size={24} />}
                  title="Ganar Músculo"
                  description="Hipertrofia y volumen."
                  isSelected={formData.goal === "muscle_gain"}
                  onClick={() => handleSelectChange("goal", "muscle_gain")}
                />
                <SelectionCard
                  icon={<Activity size={24} />}
                  title="Perder Grasa"
                  description="Definición y cardio."
                  isSelected={formData.goal === "fat_loss"}
                  onClick={() => handleSelectChange("goal", "fat_loss")}
                />
                <SelectionCard
                  icon={<ShieldCheck size={24} />}
                  title="Mantener"
                  description="Conservar mi estado físico actual."
                  isSelected={formData.goal === "maintenance"}
                  onClick={() => handleSelectChange("goal", "maintenance")}
                />
                <SelectionCard
                  icon={<HeartPulse size={24} />}
                  title="Salud General"
                  description="Moverme y sentirme mejor."
                  isSelected={formData.goal === "general_health"}
                  onClick={() => handleSelectChange("goal", "general_health")}
                />
                <SelectionCard
                  icon={<BarChart size={24} />}
                  title="Ganar Fuerza"
                  description="Levantar más peso."
                  isSelected={formData.goal === "strength_increase"}
                  onClick={() =>
                    handleSelectChange("goal", "strength_increase")
                  }
                />
              </div>
            </div>

            {/* --- Pregunta: Nivel Físico --- */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-lg font-semibold text-white">
                <Gauge size={20} className="text-cyan-400" />
                ¿Cómo describirías tu nivel físico?
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectionCard
                  icon={<Activity size={24} />}
                  title="Principiante"
                  description="Poco o nada activo."
                  isSelected={formData.fitness_level === "beginner"}
                  onClick={() =>
                    handleSelectChange("fitness_level", "beginner")
                  }
                />
                <SelectionCard
                  icon={<Activity size={24} />}
                  title="Intermedio"
                  description="Activo algunas veces por semana."
                  isSelected={formData.fitness_level === "intermediate"}
                  onClick={() =>
                    handleSelectChange("fitness_level", "intermediate")
                  }
                />
                <SelectionCard
                  icon={<Activity size={24} />}
                  title="Avanzado"
                  description="Activo de forma regular."
                  isSelected={formData.fitness_level === "advanced"}
                  onClick={() =>
                    handleSelectChange("fitness_level", "advanced")
                  }
                />
                <SelectionCard
                  icon={<Dumbbell size={24} />}
                  title="Atleta"
                  description="Entrenamiento de alto rendimiento."
                  isSelected={formData.fitness_level === "athlete"}
                  onClick={() => handleSelectChange("fitness_level", "athlete")}
                />
              </div>
            </div>

            {/* --- Pregunta: Duración Sesión --- */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-lg font-semibold text-white">
                <Timer size={20} className="text-cyan-400" />
                ¿De cuánto tiempo dispones por sesión?
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {sessionDurationOptions.map((option) => (
                  <SelectionCard
                    key={option.value}
                    icon={<Timer size={24} />}
                    title={option.label}
                    description="" // Dejamos la descripción vacía para un look más limpio
                    isSelected={formData.session_duration === option.value}
                    onClick={() =>
                      handleSelectChange("session_duration", option.value)
                    }
                  />
                ))}
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-6 sm:p-8 flex flex-col gap-4">
            {/* Mensajes de feedback */}
            {error && (
              <p className="text-red-400 font-semibold text-center">{error}</p>
            )}
            {success && (
              <p className="text-green-400 font-semibold text-center">
                Respuestas guardadas. Redirigiendo...
              </p>
            )}

            {/* MEJORA VISUAL: Botón con estilo primario */}
            <Button
              type="submit"
              className="w-full h-12 text-lg font-semibold bg-cyan-500 text-slate-900 hover:bg-cyan-600 transition-transform hover:scale-105"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
                </>
              ) : (
                <>
                  Generar Mi Plan <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
