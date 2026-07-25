"use client"

import { useQuery } from "@tanstack/react-query"

import {
  VOLUNTEER_SEARCH_MIN_LENGTH,
  volunteerSearchResponseSchema,
  type VolunteerSearchResult,
} from "../_schemas/volunteer-search.schema"

export const volunteerSearchKeys = {
  all: ["volunteers", "search"] as const,
  byQuery: (q: string) => ["volunteers", "search", q] as const,
}

async function fetchVolunteerSearch(q: string): Promise<VolunteerSearchResult[]> {
  const params = new URLSearchParams({ q })
  const res = await fetch(`/api/administration/volunteers/search?${params.toString()}`, {
    method: "GET",
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error(`Erreur recherche bénévoles (${res.status})`)
  }

  const json: unknown = await res.json()
  return volunteerSearchResponseSchema.parse(json).results
}

/**
 * Hook: useSearchActiveVolunteers
 * Rôle: Autocomplete bénévoles actifs (requête backend dès 3 caractères).
 */
export function useSearchActiveVolunteers(query: string) {
  const trimmed = query.trim()
  const enabled = trimmed.length >= VOLUNTEER_SEARCH_MIN_LENGTH

  return useQuery({
    queryKey: volunteerSearchKeys.byQuery(trimmed),
    queryFn: () => fetchVolunteerSearch(trimmed),
    enabled,
    staleTime: 30_000,
    placeholderData: (previous) => previous,
  })
}
