import { useQuery } from "@tanstack/react-query"

import type { BureauPoleContentSlug } from "@/config/bureau-poles-content"

import { poleStatsKeys } from "../_services/pole-stats-query-keys"
import { fetchPoleStats } from "../_services/fetch-pole-stats"

/**
 * Hook: usePoleStats
 * Rôle: Lire les stats dynamiques d’un pôle (dashboard bureau).
 */
export function usePoleStats(poleSlug: BureauPoleContentSlug) {
  return useQuery({
    queryKey: poleStatsKeys.byPole(poleSlug),
    queryFn: () => fetchPoleStats(poleSlug),
  })
}

