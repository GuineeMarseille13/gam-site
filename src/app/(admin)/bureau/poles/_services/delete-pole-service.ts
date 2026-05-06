import type { BureauPoleContentSlug } from "@/config/bureau-poles-content"

/**
 * Service: deletePoleService
 * Rôle: Supprimer un service dynamique (dashboard bureau).
 */
export async function deletePoleService(
  poleSlug: BureauPoleContentSlug,
  serviceId: string,
): Promise<void> {
  const res = await fetch(`/api/bureau/poles/${poleSlug}/services/${serviceId}`, {
    method: "DELETE",
    credentials: "include",
  })

  if (!res.ok) {
    throw new Error("Suppression impossible. Réessayez.")
  }
}

