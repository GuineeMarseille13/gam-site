import type { Metadata } from "next"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

import { NotreAssociationTabs } from "./_components/notre-association-tabs"
import { associationPublicQueryKeys } from "./_services/association-public-query-keys"
import {
  prefetchAboutUsPublic,
  prefetchPresidentPublic,
} from "./_services/prefetch-association-public"

export const metadata: Metadata = {
  title: "Notre association",
  description:
    "Découvrez l'histoire, les valeurs et l'équipe de l'association Guinée à Marseille.",
}

/**
 * Page publique « Notre association » — prefetch des contenus éditoriaux puis hydratation client.
 */
export default async function NotreAssociationPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  })

  await Promise.allSettled([
    queryClient.prefetchQuery({
      queryKey: associationPublicQueryKeys.president,
      queryFn: prefetchPresidentPublic,
    }),
    queryClient.prefetchQuery({
      queryKey: associationPublicQueryKeys.aboutUs,
      queryFn: prefetchAboutUsPublic,
    }),
  ])

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotreAssociationTabs />
    </HydrationBoundary>
  )
}
