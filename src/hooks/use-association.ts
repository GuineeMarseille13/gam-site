// Hooks TanStack Query pour l'association

import { useQuery } from "@tanstack/react-query"

import { associationPublicQueryKeys } from "@/app/(public)/notre-association/_services/association-public-query-keys"
import { fetchAboutUsPublic } from "@/app/(public)/notre-association/_services/fetch-about-us-public"
import { fetchPresidentPublic } from "@/app/(public)/notre-association/_services/fetch-president-public"
import { fetchTeamDataAPI } from "@/services/associationAPI"

/**
 * Hook : données du président (page Notre association).
 */
export function usePresidentData() {
  return useQuery({
    queryKey: associationPublicQueryKeys.president,
    queryFn: fetchPresidentPublic,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

/**
 * Hook : données « Qui sommes-nous ? » (page Notre association).
 */
export function useAboutUsData() {
  return useQuery({
    queryKey: associationPublicQueryKeys.aboutUs,
    queryFn: fetchAboutUsPublic,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

/**
 * Hook : données de l'équipe (page Notre association).
 */
export function useTeamData() {
  return useQuery({
    queryKey: ["association", "team"],
    queryFn: fetchTeamDataAPI,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}
