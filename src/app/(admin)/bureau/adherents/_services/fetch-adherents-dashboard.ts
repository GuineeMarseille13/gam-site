import {
  adherentListRowsSchema,
  type AdherentListRow,
} from "@/lib/schemas/adherent-list.schema"

/**
 * Charge la liste des adhérents pour le tableau de bord bureau (TanStack Query côté client).
 */
export async function fetchAdherentsDashboard(): Promise<AdherentListRow[]> {
  const res = await fetch("/api/bureau/adherents", {
    credentials: "include",
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error(
      res.status === 401
        ? "Session expirée ou accès non autorisé."
        : "Impossible de charger les adhérents.",
    )
  }

  const json: unknown = await res.json()
  return adherentListRowsSchema.parse(json)
}
