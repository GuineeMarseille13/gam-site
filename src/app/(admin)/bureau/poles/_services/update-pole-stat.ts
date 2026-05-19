import type { EditablePolePublicSlug } from "@/helpers/details-pole-bureau/_schemas/details-pole-bureau-section.schema"

import { detailsPoleStatSchema, type DetailsPoleStat } from "../_schemas/details-pole-stat.schema"
import type { DetailsPoleStatUpsertInput } from "../_schemas/details-pole-stat-form.schema"

type ApiErrorResponse = { error?: string }

async function readApiErrorMessage(res: Response): Promise<string | null> {
  try {
    const json: unknown = await res.json()
    if (typeof json === "object" && json !== null && "error" in json) {
      const msg = (json as ApiErrorResponse).error
      return typeof msg === "string" && msg.trim() !== "" ? msg : null
    }
    return null
  } catch {
    return null
  }
}

/**
 * Service: updatePoleStat
 * Rôle: Mettre à jour une stat dynamique (dashboard bureau).
 */
export async function updatePoleStat(
  poleSlug: EditablePolePublicSlug,
  statId: string,
  payload: DetailsPoleStatUpsertInput,
): Promise<DetailsPoleStat> {
  const res = await fetch(`/api/bureau/poles/${poleSlug}/stats/${statId}`, {
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
  return detailsPoleStatSchema.parse(json)
}

