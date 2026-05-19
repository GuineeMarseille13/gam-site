import type { EditablePolePublicSlug } from "@/helpers/details-pole-bureau/_schemas/details-pole-bureau-section.schema"

import {
  detailsPoleServiceSchema,
  type DetailsPoleService,
} from "../_schemas/details-pole-service.schema"
import type { DetailsPoleServiceUpsertInput } from "../_schemas/details-pole-service-form.schema"
import { readApiErrorMessage } from "./_shared/read-api-error-message"

/**
 * Service: createPoleService
 * Rôle: Créer un service dynamique (dashboard bureau).
 */
export async function createPoleService(
  poleSlug: EditablePolePublicSlug,
  payload: DetailsPoleServiceUpsertInput,
): Promise<DetailsPoleService> {
  const res = await fetch(`/api/bureau/poles/${poleSlug}/services`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const msg = await readApiErrorMessage(res)
    throw new Error(msg ?? "Création impossible. Réessayez.")
  }

  const json: unknown = await res.json()
  return detailsPoleServiceSchema.parse(json)
}

