"use client"

import { useQuery } from "@tanstack/react-query"

import {
  BENEFICIARY_IDENTITY_SEARCH_MIN_LENGTH,
  beneficiaryIdentitySearchResponseSchema,
  type BeneficiaryIdentitySearchHit,
} from "../_schemas/beneficiary-identity-search.schema"

export const beneficiaryIdentitySearchKeys = {
  all: ["beneficiaries", "identity-search"] as const,
  byQuery: (q: string) => ["beneficiaries", "identity-search", q] as const,
}

async function fetchBeneficiaryIdentitySearch(
  q: string,
): Promise<BeneficiaryIdentitySearchHit[]> {
  const params = new URLSearchParams({ q })
  const res = await fetch(`/api/administration/beneficiaries/search?${params.toString()}`, {
    method: "GET",
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error(`Erreur recherche bénéficiaires (${res.status})`)
  }

  const json: unknown = await res.json()
  return beneficiaryIdentitySearchResponseSchema.parse(json).results
}

/**
 * Hook: useSearchBeneficiariesByFirstName
 * Rôle: Suggestions de fiches connues dès 3 lettres de prénom.
 */
export function useSearchBeneficiariesByFirstName(query: string) {
  const trimmed = query.trim()
  const enabled = trimmed.length >= BENEFICIARY_IDENTITY_SEARCH_MIN_LENGTH

  return useQuery({
    queryKey: beneficiaryIdentitySearchKeys.byQuery(trimmed),
    queryFn: () => fetchBeneficiaryIdentitySearch(trimmed),
    enabled,
    staleTime: 30_000,
    placeholderData: (previous) => previous,
  })
}
