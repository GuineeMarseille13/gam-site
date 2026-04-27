import type { Pole } from "@/data/poles"

import { formatHmToFrenchLabel } from "./format-hm-fr"
import { parseScheduleToTimes } from "./parse-schedule-times"

export interface PermanenceSlotDisplay {
  date: string
  startTime: string
  endTime: string
}

/**
 * Construit la liste des créneaux pour le calendrier à partir des données statiques du pôle.
 */
export function buildSlotsFromLegacyPole(pole: Pole): PermanenceSlotDisplay[] {
  const dates = pole.permanenceDates ?? []
  const { startTime, endTime } = parseScheduleToTimes(
    pole.contactInfo?.schedule ?? "",
  )
  return dates.map((date) => ({ date, startTime, endTime }))
}

/**
 * Texte de synthèse pour la carte « Horaires » lorsque tous les créneaux partagent les mêmes heures.
 */
export function buildPermanenceScheduleSummary(slots: PermanenceSlotDisplay[]): string {
  if (slots.length === 0) {
    return ""
  }
  const first = slots[0]
  if (!first) {
    return ""
  }
  const allSame = slots.every(
    (s) => s.startTime === first.startTime && s.endTime === first.endTime,
  )
  const startFr = formatHmToFrenchLabel(first.startTime)
  const endFr = formatHmToFrenchLabel(first.endTime)
  if (allSame) {
    return `Permanences de ${startFr} à ${endFr} (jours indiqués au calendrier).`
  }
  return "Les horaires varient selon les dates — voir le calendrier ci-dessous."
}
