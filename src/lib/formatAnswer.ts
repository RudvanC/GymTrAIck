/**
 * Fitness Mapping Utilities
 *
 * This file contains human-readable mapping dictionaries and formatting functions
 * to translate backend codes into friendly display strings for the UI.
 *
 * Includes:
 * - trainingExperienceMap: maps training experience levels.
 * - fitnessLevelMap: maps overall fitness levels.
 * - goalMap: maps user fitness goals.
 * - injuriesMap: maps injury codes to readable labels.
 * - formatInjuries: formats injury lists into readable strings.
 * - formatSessionDuration: parses duration strings (e.g., "90min") into natural language.
 */

export const trainingExperienceMap: Record<string, string> = {
  none: "Sin experiencia",
  little: "Poca experiencia",
  moderate: "Experiencia moderada",
  high: "Mucha experiencia",
};

export const fitnessLevelMap: Record<string, string> = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado",
  athlete: "Atleta",
};

export const goalMap: Record<string, string> = {
  muscle_gain: "Ganancia muscular",
  fat_loss: "Pérdida de peso",
  maintenance: "Mantenimiento",
  general_health: "Salud general",
  strength_increase: "Aumento de fuerza",
};

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
 * Converts a list of injury codes into a human-readable comma-separated string.
 *
 * @param injuries - List of injury codes (array or JSON stringified).
 * @returns Comma-separated readable string or "Ninguna" if empty.
 */
export function formatInjuries(injuries?: string[] | string): string {
  if (!injuries || injuries.length === 0) return "Ninguna";
  const list = Array.isArray(injuries) ? injuries : JSON.parse(injuries);
  return list.map((inj: string) => injuriesMap[inj] || inj).join(", ");
}

/**
 * Parses a string like "90min" into a readable format like "1 hora 30 minutos".
 *
 * @param duration - String in format "Xm" (e.g., "45min", "120min").
 * @returns Readable duration or fallback message.
 */
export function formatSessionDuration(duration: string): string {
  const match = duration.match(/^(\d+)min$/);
  if (!match) return "Duración no especificada";

  const totalMinutes = parseInt(match[1], 10);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours} hora${hours > 1 ? "s" : ""}`);
  if (minutes > 0) parts.push(`${minutes} minuto${minutes > 1 ? "s" : ""}`);

  return parts.join(" ");
}
