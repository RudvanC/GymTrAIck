"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { insertUserAnswers } from "@/lib/userAnswers/insert";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function QuestionnaireForm() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    training_experience: "",
    availability: "",
    injuries: "",
    equipment_access: false,
    goal: "",
    fitness_level: "",
    session_duration: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (success) {
      timer = setTimeout(() => {
        router.push("/dashboard");
      }, 2500);
    }
    return () => clearTimeout(timer);
  }, [success, router]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSelectChange(name: string, value: string | boolean) {
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    if (
      !formData.training_experience ||
      !formData.availability ||
      !formData.goal ||
      !formData.fitness_level ||
      !formData.session_duration
    ) {
      setError("Por favor, completa todos los campos obligatorios.");
      setLoading(false);
      return;
    }

    const availabilityNum = parseInt(formData.availability, 10);
    if (isNaN(availabilityNum) || availabilityNum <= 0 || availabilityNum > 7) {
      setError(
        "Los días de disponibilidad deben ser un número válido entre 1 y 7."
      );
      setLoading(false);
      return;
    }

    const sessionDurationNum = parseInt(formData.session_duration, 10);
    if (isNaN(sessionDurationNum) || sessionDurationNum <= 0) {
      setError(
        "La duración de la sesión debe ser un número positivo en minutos."
      );
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        user_id: user.id,
      };

      await insertUserAnswers(payload);
      setSuccess(true);
      setLoading(false);
      setFormData({
        training_experience: "",
        availability: "",
        injuries: "",
        equipment_access: false,
        goal: "",
        fitness_level: "",
        session_duration: "",
      });
    } catch (err: any) {
      setError(
        err.message || "Error al guardar las respuestas. Inténtalo de nuevo."
      );
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

          <div className="space-y-2">
            <Label htmlFor="session_duration">
              ¿Cuánto tiempo puedes dedicar por sesión (minutos)?
            </Label>
            <Input
              id="session_duration"
              type="number"
              name="session_duration"
              placeholder="Ej: 45"
              min={10}
              value={formData.session_duration}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="injuries">
              ¿Tienes alguna lesión o condición física a considerar?
            </Label>
            <Textarea
              id="injuries"
              name="injuries"
              placeholder="Describe tus limitaciones o indica 'Ninguna' si no aplica"
              value={formData.injuries}
              onChange={handleChange}
            />
          </div>

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
                  Avanzado (Muy activo y experimentado)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <p className="text-sm text-red-600 p-3 bg-red-100 rounded-md">
              {error}
            </p>
          )}
          {success && (
            <p className="text-sm text-green-600 p-3 bg-green-100 rounded-md">
              ¡Respuestas guardadas correctamente! Serás redirigido al
              dashboard.
            </p>
          )}

          <Button
            className="w-full py-3 mt-4"
            type="submit"
            disabled={loading || success}
          >
            {loading
              ? "Guardando respuestas..."
              : success
              ? "Guardado con Éxito"
              : "Guardar y Continuar"}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
