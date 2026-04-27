/**
 * Convertit « HH:mm » en libellé court français (ex. 14:00 → 14h, 14:30 → 14h30).
 */
export function formatHmToFrenchLabel(hm: string): string {
  const parts = hm.split(":")
  if (parts.length !== 2) return hm
  const h = Number.parseInt(parts[0] ?? "0", 10)
  const m = Number.parseInt(parts[1] ?? "0", 10)
  if (Number.isNaN(h) || Number.isNaN(m)) return hm
  if (m === 0) return `${h}h`
  return `${h}h${String(m).padStart(2, "0")}`
}

/**
 * Plage affichée sur une carte du calendrier (ex. 14h-16h).
 */
export function formatSlotRangeFr(startHm: string, endHm: string): string {
  return `${formatHmToFrenchLabel(startHm)}-${formatHmToFrenchLabel(endHm)}`
}
