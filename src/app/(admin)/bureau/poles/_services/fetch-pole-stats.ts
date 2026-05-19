import type { EditablePolePublicSlug } from "@/helpers/details-pole-bureau/_schemas/details-pole-bureau-section.schema"

import {
  detailsPoleStatListSchema,
  type DetailsPoleStat,
} from "../_schemas/details-pole-stat.schema"

/**
 * Service: fetchPoleStats
 * Rôle: Charger les stats dynamiques d’un pôle (dashboard bureau).
 */
export async function fetchPoleStats(
  poleSlug: EditablePolePublicSlug,
): Promise<DetailsPoleStat[]> {
  const res = await fetch(`/api/bureau/poles/${poleSlug}/stats`, {
    credentials: "include",
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error(
      res.status === 401
        ? "Session expirée ou accès non autorisé."
        : "Impossible de charger les statistiques.",
    )
  }

  const json: unknown = await res.json()
  return detailsPoleStatListSchema.parse(json)
}

