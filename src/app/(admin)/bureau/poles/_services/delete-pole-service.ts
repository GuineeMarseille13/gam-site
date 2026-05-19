import type { EditablePolePublicSlug } from "@/helpers/details-pole-bureau/_schemas/details-pole-bureau-section.schema"

/**
 * Service: deletePoleService
 * Rôle: Supprimer un service dynamique (dashboard bureau).
 */
export async function deletePoleService(
  poleSlug: EditablePolePublicSlug,
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

