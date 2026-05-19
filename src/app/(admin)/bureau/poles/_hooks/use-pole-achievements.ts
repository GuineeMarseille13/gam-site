import { useQuery } from "@tanstack/react-query"

import type { EditablePolePublicSlug } from "@/helpers/details-pole-bureau/_schemas/details-pole-bureau-section.schema"

import { poleAchievementsKeys } from "../_services/pole-achievements-query-keys"
import { fetchPoleAchievements } from "../_services/fetch-pole-achievements"

/**
 * Hook: usePoleAchievements
 * Rôle: Lire les réalisations dynamiques d’un pôle (dashboard bureau).
 */
export function usePoleAchievements(poleSlug: EditablePolePublicSlug) {
  return useQuery({
    queryKey: poleAchievementsKeys.byPole(poleSlug),
    queryFn: () => fetchPoleAchievements(poleSlug),
  })
}
