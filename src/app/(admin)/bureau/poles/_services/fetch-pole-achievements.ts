import type { EditablePolePublicSlug } from "@/helpers/details-pole-bureau/_schemas/details-pole-bureau-section.schema"

import {
  detailsPoleAchievementListSchema,
  type DetailsPoleAchievement,
} from "../_schemas/details-pole-achievement.schema"

/**
 * Service: fetchPoleAchievements
 * Rôle: Charger les réalisations dynamiques d’un pôle (dashboard bureau).
 */
export async function fetchPoleAchievements(
  poleSlug: EditablePolePublicSlug,
): Promise<DetailsPoleAchievement[]> {
  const res = await fetch(`/api/bureau/poles/${poleSlug}/achievements`, {
    credentials: "include",
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error(
      res.status === 401
        ? "Session expirée ou accès non autorisé."
        : "Impossible de charger les réalisations.",
    )
  }

  const json: unknown = await res.json()
  return detailsPoleAchievementListSchema.parse(json)
}
