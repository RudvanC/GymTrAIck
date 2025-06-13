// hooks/useQuestionnaireForm.ts
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/**
 * Custom hook que maneja la lógica del formulario de cuestionario del usuario.
 *
 * Incluye estado del formulario, manejo de inputs, validación, envío y gestión de errores.
 * Utiliza autenticación de usuario, navegación y llamadas a la API interna (`/api/user-answers`).
 *
 * @returns {Object} Estado y funciones relacionadas con el formulario:
 * - `formData`: datos del formulario.
 * - `handleChange`: manejador para inputs tipo texto y checkbox.
 * - `handleSelectChange`: manejador para selects y booleanos.
 * - `handleSubmit`: manejador de envío del formulario.
 * - `loading`: estado de carga mientras se envían datos.
 * - `error`: mensaje de error (si lo hay).
 * - `success`: indica si el envío fue exitoso.
 * - `setSuccess`: setter para el estado `success`.
 *
 * @example
 * ```tsx
 * const {
 *   formData,
 *   handleChange,
 *   handleSelectChange,
 *   handleSubmit,
 *   loading,
 *   error,
 *   success
 * } = useQuestionnaireForm();
 * ```
 */
export function useQuestionnaireForm() {
  // Router para navegación (si se necesita post-submit)
  const router = useRouter();

  // Usuario autenticado (hook personalizado)
  const { user } = useAuth();

  /**
   * Estado del formulario con los campos del cuestionario.
   */
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

  /**
   * Manejador de cambios para inputs y textareas.
   * Soporta lógica especial para checkboxes de `injuries`.
   *
   * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e Evento de cambio
   */
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

  /**
   * Manejador para campos `select` o booleanos personalizados.
   *
   * @param {string} name Nombre del campo
   * @param {string | boolean} value Valor del campo
   */
  function handleSelectChange(name: string, value: string | boolean) {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  /**
   * Envia los datos del cuestionario al endpoint de la API.
   *
   * @param {any} payload Datos del formulario + ID de usuario
   * @throws Error si la respuesta de la API no es satisfactoria
   */
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

  /**
   * Manejador de envío del formulario. Valida campos, llama a `submitAnswers` y actualiza el estado.
   *
   * @param {React.FormEvent} e Evento de envío
   */
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
