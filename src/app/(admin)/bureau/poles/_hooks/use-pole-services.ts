import { useQuery } from "@tanstack/react-query"

import type { BureauPoleContentSlug } from "@/config/bureau-poles-content"

import { poleServicesKeys } from "../_services/pole-services-query-keys"
import { fetchPoleServices } from "../_services/fetch-pole-services"

/**
 * Hook: usePoleServices
 * Rôle: Lire les services dynamiques d’un pôle (dashboard bureau).
 */
export function usePoleServices(poleSlug: BureauPoleContentSlug) {
  return useQuery({
    queryKey: poleServicesKeys.byPole(poleSlug),
    queryFn: () => fetchPoleServices(poleSlug),
  })
}

