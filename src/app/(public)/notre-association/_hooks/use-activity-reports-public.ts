import { useQuery } from "@tanstack/react-query"
import { fetchActivityReportsPublic } from "../_services/fetch-activity-reports-public"

export const activityReportsPublicQueryKey = ["activityReports", "public"] as const

/**
 * Liste des rapports d'activité affichés sur « Notre association » (TanStack Query + fetch validé Zod).
 */
export function useActivityReportsPublic() {
  return useQuery({
    queryKey: activityReportsPublicQueryKey,
    queryFn: fetchActivityReportsPublic,
    staleTime: 60_000,
  })
}
