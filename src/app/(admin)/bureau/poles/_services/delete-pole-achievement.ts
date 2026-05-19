import type { EditablePolePublicSlug } from "@/helpers/details-pole-bureau/_schemas/details-pole-bureau-section.schema"

/**
 * Service: deletePoleAchievement
 * Rôle: Supprimer une réalisation via l’API bureau.
 */
export async function deletePoleAchievement(
  poleSlug: EditablePolePublicSlug,
  achievementId: string,
): Promise<void> {
  const res = await fetch(
    `/api/bureau/poles/${poleSlug}/achievements/${achievementId}`,
    {
      method: "DELETE",
      credentials: "include",
    },
  )

  if (!res.ok) {
    throw new Error("Suppression impossible.")
  }
}
