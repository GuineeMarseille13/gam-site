"use server"

import { getPermanenceVolunteerYearDetail } from "../_services/get-permanence-volunteer-year-detail"
import {
  permanenceVolunteerYearDetailQuerySchema,
  type PermanenceVolunteerYearDetailRow,
} from "../_schemas/permanence-hours-annual-stats.schema"

export type GetPermanenceVolunteerYearDetailResult =
  | { success: true; rows: PermanenceVolunteerYearDetailRow[] }
  | { success: false; error: string }

/**
 * Charge le détail des journées de permanence pour un membre et une année (stats).
 */
export async function loadPermanenceVolunteerYearDetail(
  raw: unknown,
): Promise<GetPermanenceVolunteerYearDetailResult> {
  const parsed = permanenceVolunteerYearDetailQuerySchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: "Paramètres invalides." }
  }

  try {
    const rows = await getPermanenceVolunteerYearDetail(parsed.data)
    return { success: true, rows }
  } catch (err) {
    console.error("[loadPermanenceVolunteerYearDetail]", err)
    return { success: false, error: "Impossible de charger le détail." }
  }
}
