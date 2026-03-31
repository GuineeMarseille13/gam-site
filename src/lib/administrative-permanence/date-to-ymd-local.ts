/**
 * YYYY-MM-DD selon le calendrier local (évite les décalages fuseau vs. ISO minuit).
 */
export function dateToYmdLocal(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}
