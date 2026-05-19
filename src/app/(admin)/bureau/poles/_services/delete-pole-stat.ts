import type { EditablePolePublicSlug } from "@/helpers/details-pole-bureau/_schemas/details-pole-bureau-section.schema"

/**
 * Service: deletePoleStat
 * Rôle: Supprimer une stat dynamique (dashboard bureau).
 */
export async function deletePoleStat(
  poleSlug: EditablePolePublicSlug,
  statId: string,
): Promise<void> {
  const res = await fetch(`/api/bureau/poles/${poleSlug}/stats/${statId}`, {
    method: "DELETE",
    credentials: "include",
  })

  if (!res.ok) {
    throw new Error("Suppression impossible. Réessayez.")
  }
}

