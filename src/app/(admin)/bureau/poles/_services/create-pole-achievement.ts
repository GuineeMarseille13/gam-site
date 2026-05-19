import type { EditablePolePublicSlug } from "@/helpers/details-pole-bureau/_schemas/details-pole-bureau-section.schema"

import type { DetailsPoleAchievementUpsertInput } from "../_schemas/details-pole-achievement-form.schema"
import { detailsPoleAchievementSchema } from "../_schemas/details-pole-achievement.schema"

/**
 * Service: createPoleAchievement
 * Rôle: Créer une réalisation via l’API bureau.
 */
export async function createPoleAchievement(
  poleSlug: EditablePolePublicSlug,
  payload: DetailsPoleAchievementUpsertInput,
) {
  const res = await fetch(`/api/bureau/poles/${poleSlug}/achievements`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  const json: unknown = await res.json()
  if (!res.ok) {
    const message =
      typeof json === "object" &&
      json !== null &&
      "error" in json &&
      typeof (json as { error: unknown }).error === "string"
        ? (json as { error: string }).error
        : "Création impossible."
    throw new Error(message)
  }

  return detailsPoleAchievementSchema.parse(json)
}
