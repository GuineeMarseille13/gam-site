const DEFAULT_START = "14:00"
const DEFAULT_END = "16:00"

/**
 * Extrait des heures depuis un texte libre (ex. « Permanences les samedis de 14h à 16h »).
 */
export function parseScheduleToTimes(schedule: string): {
  startTime: string
  endTime: string
} {
  const match = schedule.match(/(\d{1,2})h\s*(?:à|au|-)\s*(\d{1,2})h/)
  if (!match) {
    return { startTime: DEFAULT_START, endTime: DEFAULT_END }
  }
  const a = Number.parseInt(match[1] ?? "14", 10)
  const b = Number.parseInt(match[2] ?? "16", 10)
  return {
    startTime: `${String(a).padStart(2, "0")}:00`,
    endTime: `${String(b).padStart(2, "0")}:00`,
  }
}
