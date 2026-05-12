import { adherentDetailSchema, type AdherentDetail } from "@/lib/schemas/adherent-detail.schema";

/**
 * Charge la fiche détail d’un adhérent (cotisations + paiements).
 */
export async function fetchAdherentDetail(personId: string): Promise<AdherentDetail> {
  const res = await fetch(
    `/api/bureau/adherents/${encodeURIComponent(personId)}`,
    {
      credentials: "include",
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error(
      res.status === 404
        ? "Adhérent introuvable."
        : res.status === 401
          ? "Session expirée ou accès non autorisé."
          : "Impossible de charger la fiche adhérent.",
    );
  }

  const json: unknown = await res.json();
  return adherentDetailSchema.parse(json);
}
