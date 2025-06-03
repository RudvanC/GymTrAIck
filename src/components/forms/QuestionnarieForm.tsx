"use client";
import React, { useState } from "react";
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

export default function QuestionnarieForm() {
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
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        ...formData,
        availability: formData.availability.toString(),
        session_duration: formData.session_duration.toString(),
      };

      await insertUserAnswers(payload);
      setSuccess(true);
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
      setError(err.message || "Error inserting data");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="max-w-2xl mx-auto mt-10">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Cuestionario de entrenamiento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Experience */}
          <div className="space-y-2">
            <Label>¿Cuánto tiempo has estado entrenando?</Label>
            <Select
              onValueChange={(value) =>
                handleSelectChange("training_experience", value)
              }
              value={formData.training_experience}
            >
              <SelectTrigger>
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

          {/* Availability */}
          <div className="space-y-2">
            <Label>¿Cuántos días a la semana puedes entrenar?</Label>
            <Input
              type="number"
              name="availability"
              placeholder="e.g. 3"
              min={1}
              max={7}
              value={formData.availability}
              onChange={handleChange}
            />
          </div>

          {/* Session Duration */}
          <div className="space-y-2">
            <Label>¿Cuánto tiempo puedes dedicar por sesión (minutos)?</Label>
            <Input
              type="number"
              name="session_duration"
              placeholder="e.g. 45"
              value={formData.session_duration}
              onChange={handleChange}
            />
          </div>

          {/* Injuries */}
          <div className="space-y-2">
            <Label>¿Tienes alguna lesión o condición a considerar?</Label>
            <Textarea
              name="injuries"
              placeholder="Describe tus limitaciones si las hay"
              value={formData.injuries}
              onChange={handleChange}
            />
          </div>

          {/* Equipment Access */}
          <div className="space-y-2">
            <Label>¿Tienes acceso a equipo o gimnasio?</Label>
            <Select
              onValueChange={(value) =>
                handleSelectChange("equipment_access", value === "true")
              }
              value={formData.equipment_access.toString()}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una opción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Si</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Goal */}
          <div className="space-y-2">
            <Label>¿Cuál es tu objetivo principal?</Label>
            <Select
              onValueChange={(value) => handleSelectChange("goal", value)}
              value={formData.goal}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tu objetivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gain">Ganar masa muscular</SelectItem>
                <SelectItem value="lose">Perder grasa</SelectItem>
                <SelectItem value="maintain">Mantener condición física</SelectItem>
                <SelectItem value="health">Mejorar general salud</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Fitness Level */}
          <div className="space-y-2">
            <Label>¿Cómo describirías tu nivel de condición física actual?</Label>
            <Select
              onValueChange={(value) =>
                handleSelectChange("fitness_level", value)
              }
              value={formData.fitness_level}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tu nivel actual" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Bajo</SelectItem>
                <SelectItem value="medium">Medio</SelectItem>
                <SelectItem value="high">Alto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-red-600">{error}</p>}
          {success && (
            <p className="text-green-600">¡Respuestas guardadas correctamente!</p>
          )}

          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar respuestas"}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
