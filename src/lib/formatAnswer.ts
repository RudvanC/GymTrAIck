/**
 * Mapeo de niveles de experiencia en entrenamiento del backend a descripciones legibles.
 */
export const trainingExperienceMap: Record<string, string> = {
  none: "Sin experiencia",
  little: "Poca experiencia",
  moderate: "Experiencia moderada",
  high: "Mucha experiencia",
};

/**
 * Mapeo de niveles de condición física del backend a descripciones legibles.
 */
export const fitnessLevelMap: Record<string, string> = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado",
  athlete: "Atleta",
};

/**
 * Mapeo de objetivos de fitness del backend a descripciones legibles.
 */
export const goalMap: Record<string, string> = {
  muscle_gain: "Ganancia muscular",
  fat_loss: "Pérdida de peso",
  maintenance: "Mantenimiento",
  general_health: "Salud general",
  strength_increase: "Aumento de fuerza",
};

/**
 * Mapeo de tipos de lesiones del backend a descripciones legibles.
 */
export const injuriesMap: Record<string, string> = {
  none: "Ninguna",
  knee: "Rodilla",
  hand: "Mano",
  back: "Espalda",
  shoulder: "Hombro",
  ankle: "Tobillo",
  wrist: "Muñeca",
  other: "Otro",
};

/**
 * Convierte un arreglo de identificadores de lesiones en una cadena legible para humanos.
 *
 * @param injuries - Lista de lesiones como string o array de strings. Puede ser un JSON stringificado.
 * @returns Una cadena con las lesiones separadas por comas o "Ninguna" si está vacío o indefinido.
 *
 * @example
 * formatInjuries(["knee", "back"]) // "Rodilla, Espalda"
 * formatInjuries("[]") // "Ninguna"
 */
export function formatInjuries(injuries?: string[] | string): string {
  if (!injuries || injuries.length === 0) return "Ninguna";
  const list = Array.isArray(injuries) ? injuries : JSON.parse(injuries);
  return list.map((inj: string) => injuriesMap[inj] || inj).join(", ");
}

/**
 * Convierte una duración en minutos (formato "30min", "90min", etc.) a un string legible.
 *
 * @param duration - Cadena que representa duración en minutos, como "90min".
 * @returns Una cadena formateada como "1 hora 30 minutos" o un mensaje si el formato es inválido.
 *
 * @example
 * formatSessionDuration("90min") // "1 hora 30 minutos"
 * formatSessionDuration("45min") // "45 minutos"
 */
export function formatSessionDuration(duration: string): string {
  const match = duration.match(/^(\d+)min$/);
  if (!match) return "Duración no especificada";

  const totalMinutes = parseInt(match[1], 10);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const parts = [];
  if (hours > 0) {
    parts.push(`${hours} hora${hours > 1 ? "s" : ""}`);
  }
  if (minutes > 0) {
    parts.push(`${minutes} minuto${minutes > 1 ? "s" : ""}`);
  }

  return parts.join(" ");
}
