"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchAdherentDetail } from "../_services/fetch-adherent-detail";
import { adherentDashboardKeys } from "../_services/adherent-query-keys";

/**
 * Fiche détail d’un adhérent (cotisations) — chargée à l’ouverture du panneau.
 */
export function useAdherentDetail(personId: string | null) {
  return useQuery({
    queryKey:
      personId !== null
        ? adherentDashboardKeys.detail(personId)
        : ["bureau", "adherents", "detail", "idle"],
    queryFn: () => fetchAdherentDetail(personId as string),
    enabled: personId !== null,
  });
}
