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
  knee: "Rodilla",
  hand: "Mano",
  back: "Espalda",
  shoulder: "Hombro",
  ankle: "Tobillo",
  wrist: "Codo",
  other: "Otro",
};

export function formatInjuries(injuries?: string[] | string): string {
  if (!injuries || injuries.length === 0) return "Ninguna";
  const list = Array.isArray(injuries) ? injuries : JSON.parse(injuries);
  return list.map((inj: string) => injuriesMap[inj] || inj).join(", ");
}

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
