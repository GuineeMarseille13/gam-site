import type { BureauPoleContentSlug } from "@/config/bureau-poles-content"

import {
  detailsPoleServiceSchema,
  type DetailsPoleService,
} from "../_schemas/details-pole-service.schema"
import type { DetailsPoleServiceUpsertInput } from "../_schemas/details-pole-service-form.schema"
import { readApiErrorMessage } from "./_shared/read-api-error-message"

/**
 * Service: updatePoleService
 * Rôle: Mettre à jour un service dynamique (dashboard bureau).
 */
export async function updatePoleService(
  poleSlug: BureauPoleContentSlug,
  serviceId: string,
  payload: DetailsPoleServiceUpsertInput,
): Promise<DetailsPoleService> {
  const res = await fetch(`/api/bureau/poles/${poleSlug}/services/${serviceId}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const msg = await readApiErrorMessage(res)
    throw new Error(msg ?? "Mise à jour impossible. Réessayez.")
  }

  const json: unknown = await res.json()
  return detailsPoleServiceSchema.parse(json)
}

