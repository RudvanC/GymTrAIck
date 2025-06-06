"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const injuriesOptions = [
  "Ninguna",
  "Rodilla",
  "Hombro",
  "Espalda",
  "Tobillo",
  "Muñeca",
];

const sessionDurationOptions = [
  ">15 min",
  ">30 min",
  ">45 min",
  ">60 min",
  ">90 min",
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
      const timer = setTimeout(() => router.push("/dashboard"), 2500);
      return () => clearTimeout(timer);
    }
  }, [success, router]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value, checked } = e.target as HTMLInputElement;

    if (name === "injuries") {
      let newInjuries = [...formData.injuries];
      if (value === "Ninguna") {
        newInjuries = checked ? ["Ninguna"] : [];
      } else {
        if (checked) {
          newInjuries = newInjuries.filter((inj) => inj !== "Ninguna");
          if (!newInjuries.includes(value)) newInjuries.push(value);
        } else {
          newInjuries = newInjuries.filter((inj) => inj !== value);
        }
      }
      setFormData((prev) => ({ ...prev, injuries: newInjuries }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }

  function handleSelectChange(name: string, value: string | boolean) {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function submitAnswers(payload: any) {
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
        availability: availabilityNum,
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
    } catch (err: any) {
      setError(
        err.message || "Error al guardar las respuestas. Inténtalo de nuevo."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="max-w-2xl mx-auto mt-10 mb-10">
      <form onSubmit={handleSubmit}>
        <CardHeader className="text-center">
          <CardTitle className="text-xl sm:text-2xl">
            Cuestionario de Entrenamiento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-4 sm:p-6">
          {/* Experiencia */}
          <div className="space-y-2">
            <Label htmlFor="training_experience">
              ¿Cuánto tiempo has estado entrenando?
            </Label>
            <Select
              name="training_experience"
              onValueChange={(value) =>
                handleSelectChange("training_experience", value)
              }
              value={formData.training_experience}
            >
              <SelectTrigger id="training_experience">
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

          {/* Disponibilidad */}
          <div className="space-y-2">
            <Label htmlFor="availability">
              ¿Cuántos días a la semana puedes entrenar?
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
            />
          </div>

          {/* Lesiones */}
          <div className="space-y-2">
            <Label>
              ¿Tienes alguna lesión o condición física a considerar?
            </Label>
            <div className="flex flex-col gap-1">
              {injuriesOptions.map((inj) => (
                <label key={inj} className="inline-flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="injuries"
                    value={inj}
                    checked={formData.injuries.includes(inj)}
                    onChange={handleChange}
                  />
                  <span>{inj}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Acceso a equipo */}
          <div className="space-y-2">
            <Label htmlFor="equipment_access">
              ¿Tienes acceso a equipo de gimnasio o pesas?
            </Label>
            <Select
              name="equipment_access"
              onValueChange={(value) =>
                handleSelectChange("equipment_access", value === "true")
              }
              value={formData.equipment_access.toString()}
            >
              <SelectTrigger id="equipment_access">
                <SelectValue placeholder="Selecciona una opción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Sí, tengo acceso completo</SelectItem>
                <SelectItem value="false">
                  No, entreno en casa (poco o nada de equipo)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Objetivo */}
          <div className="space-y-2">
            <Label htmlFor="goal">
              ¿Cuál es tu objetivo principal de entrenamiento?
            </Label>
            <Select
              name="goal"
              onValueChange={(value) => handleSelectChange("goal", value)}
              value={formData.goal}
            >
              <SelectTrigger id="goal">
                <SelectValue placeholder="Selecciona tu objetivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="muscle_gain">Ganar masa muscular</SelectItem>
                <SelectItem value="fat_loss">Perder grasa</SelectItem>
                <SelectItem value="maintenance">
                  Mantener condición física
                </SelectItem>
                <SelectItem value="general_health">
                  Mejorar salud general
                </SelectItem>
                <SelectItem value="strength_increase">
                  Aumentar fuerza
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Nivel físico */}
          <div className="space-y-2">
            <Label htmlFor="fitness_level">
              ¿Cómo describirías tu nivel de condición física actual?
            </Label>
            <Select
              name="fitness_level"
              onValueChange={(value) =>
                handleSelectChange("fitness_level", value)
              }
              value={formData.fitness_level}
            >
              <SelectTrigger id="fitness_level">
                <SelectValue placeholder="Selecciona tu nivel actual" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">
                  Principiante (Poco o nada activo)
                </SelectItem>
                <SelectItem value="intermediate">
                  Intermedio (Activo algunas veces por semana)
                </SelectItem>
                <SelectItem value="advanced">
                  Avanzado (Activo regularmente)
                </SelectItem>
                <SelectItem value="athlete">Atleta o similar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Duración sesión */}
          <div className="space-y-2">
            <Label htmlFor="session_duration">
              Duración promedio de tus sesiones de entrenamiento
            </Label>
            <Select
              name="session_duration"
              onValueChange={(value) =>
                handleSelectChange("session_duration", value)
              }
              value={formData.session_duration}
            >
              <SelectTrigger id="session_duration">
                <SelectValue placeholder="Selecciona duración" />
              </SelectTrigger>
              <SelectContent>
                {sessionDurationOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Mensajes */}
          {error && (
            <p className="text-red-600 font-semibold text-center">{error}</p>
          )}

          {success && (
            <p className="text-green-600 font-semibold text-center">
              Respuestas guardadas correctamente. Redirigiendo...
            </p>
          )}

          {/* Botón */}
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            variant="default"
          >
            {loading ? "Guardando..." : "Enviar respuestas"}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
