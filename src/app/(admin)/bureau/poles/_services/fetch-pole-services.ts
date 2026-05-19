import type { EditablePolePublicSlug } from "@/helpers/details-pole-bureau/_schemas/details-pole-bureau-section.schema"

import {
  detailsPoleServiceListSchema,
  type DetailsPoleService,
} from "../_schemas/details-pole-service.schema"

/**
 * Service: fetchPoleServices
 * Rôle: Charger les services dynamiques d’un pôle (dashboard bureau).
 */
export async function fetchPoleServices(
  poleSlug: EditablePolePublicSlug,
): Promise<DetailsPoleService[]> {
  const res = await fetch(`/api/bureau/poles/${poleSlug}/services`, {
    credentials: "include",
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error(
      res.status === 401
        ? "Session expirée ou accès non autorisé."
        : "Impossible de charger les services.",
    )
  }

  const json: unknown = await res.json()
  return detailsPoleServiceListSchema.parse(json)
}

