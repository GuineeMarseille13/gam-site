import { useQuery } from "@tanstack/react-query"

import type { EditablePolePublicSlug } from "@/helpers/details-pole-bureau/_schemas/details-pole-bureau-section.schema"

import { poleServicesKeys } from "../_services/pole-services-query-keys"
import { fetchPoleServices } from "../_services/fetch-pole-services"

/**
 * Hook: usePoleServices
 * Rôle: Lire les services dynamiques d’un pôle (dashboard bureau).
 */
export function usePoleServices(poleSlug: EditablePolePublicSlug) {
  return useQuery({
    queryKey: poleServicesKeys.byPole(poleSlug),
    queryFn: () => fetchPoleServices(poleSlug),
  })
}

