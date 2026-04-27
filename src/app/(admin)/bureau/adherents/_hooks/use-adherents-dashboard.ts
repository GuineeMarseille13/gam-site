"use client"

import { useQuery } from "@tanstack/react-query"

import type { AdherentListRow } from "@/lib/schemas/adherent-list.schema"

import { adherentDashboardKeys } from "../_services/adherent-query-keys"
import { fetchAdherentsDashboard } from "../_services/fetch-adherents-dashboard"

const STALE_MS = 60_000

/**
 * Liste des adhérents (cotisations) pour le bureau — cache TanStack Query + refetch explicite possible.
 */
export function useAdherentsDashboard() {
  return useQuery<AdherentListRow[], Error>({
    queryKey: adherentDashboardKeys.all,
    queryFn: fetchAdherentsDashboard,
    staleTime: STALE_MS,
  })
}
