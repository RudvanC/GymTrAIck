// hooks/useQuestionnaireForm.ts
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export function useQuestionnaireForm() {
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
      setError("Usuario no autenticado.");
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
      setError("Los días deben estar entre 1 y 7.");
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
      setError(err.message || "Error al guardar respuestas.");
    } finally {
      setLoading(false);
    }
  }

  return {
    formData,
    handleChange,
    handleSelectChange,
    handleSubmit,
    loading,
    error,
    success,
    setSuccess,
  };
}
