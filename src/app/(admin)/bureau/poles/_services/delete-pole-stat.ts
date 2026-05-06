import type { BureauPoleContentSlug } from "@/config/bureau-poles-content"

/**
 * Service: deletePoleStat
 * Rôle: Supprimer une stat dynamique (dashboard bureau).
 */
export async function deletePoleStat(
  poleSlug: BureauPoleContentSlug,
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

