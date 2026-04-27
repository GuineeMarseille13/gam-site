import type { Metadata } from "next"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

import { getAdherentsForDashboard } from "@/lib/data/adherents"

import { AdherentsList } from "./_components/adherents-list"
import { adherentDashboardKeys } from "./_services/adherent-query-keys"

export const metadata: Metadata = { title: "Adhérents" }

export default async function AdherentsPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        refetchOnWindowFocus: false,
      },
    },
  })

  await queryClient.prefetchQuery({
    queryKey: adherentDashboardKeys.all,
    queryFn: getAdherentsForDashboard,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdherentsList />
    </HydrationBoundary>
  )
}
