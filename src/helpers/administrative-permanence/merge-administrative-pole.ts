import type { Pole } from "@/data/poles"

import type { PermanenceSlotDisplay } from "./build-pole-slots"
import { buildPermanenceScheduleSummary } from "./build-pole-slots"
import {
  ADMINISTRATIVE_HORAIRES_FALLBACK_NO_SLOTS,
  ADMINISTRATIVE_POLE_SLUG,
} from "./constants"

/**
 * Applique toujours les créneaux issus de la base au pôle administratif (site public).
 * Les dates statiques dans `poles.ts` ne sont pas utilisées pour le calendrier.
 */
export function mergeAdministrativePoleWithDb(
  pole: Pole,
  dbSlots: PermanenceSlotDisplay[],
  horairesCardText: string | null,
): Pole {
  if (pole.slug !== ADMINISTRATIVE_POLE_SLUG) {
    return pole
  }

  const customHoraires =
    horairesCardText != null && horairesCardText.trim() !== ""
      ? horairesCardText.trim()
      : null

  const summary =
    dbSlots.length > 0
      ? customHoraires ?? buildPermanenceScheduleSummary(dbSlots)
      : customHoraires ??
        pole.contactInfo?.schedule ??
        ADMINISTRATIVE_HORAIRES_FALLBACK_NO_SLOTS

  return {
    ...pole,
    permanenceSlots: dbSlots,
    permanenceDates: dbSlots.map((s) => s.date),
    permanenceScheduleSummary: summary,
  }
}
