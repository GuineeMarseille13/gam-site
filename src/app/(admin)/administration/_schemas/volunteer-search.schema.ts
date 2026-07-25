import { z } from "zod"

export const VOLUNTEER_SEARCH_MIN_LENGTH = 3
export const VOLUNTEER_SEARCH_MAX_RESULTS = 12

/**
 * Paramètre de recherche de bénévoles par nom (autocomplete).
 */
export const volunteerSearchQuerySchema = z
  .object({
    q: z
      .string()
      .trim()
      .min(
        VOLUNTEER_SEARCH_MIN_LENGTH,
        `Saisissez au moins ${VOLUNTEER_SEARCH_MIN_LENGTH} lettres.`,
      )
      .max(80),
  })
  .strict()

export type VolunteerSearchQuery = z.infer<typeof volunteerSearchQuerySchema>

/**
 * Suggestion renvoyée par la recherche de bénévoles actifs.
 * `firstName` + `email` : désambiguïsation au survol (homonymes).
 */
export const volunteerSearchResultSchema = z
  .object({
    volunteerId: z.string().min(1),
    personId: z.string().min(1),
    fullName: z.string().min(1).max(160),
    firstName: z.string().min(1).max(80),
    email: z
      .string()
      .max(254)
      .nullable()
      .transform((value) => {
        const trimmed = value?.trim()
        return trimmed ? trimmed : null
      }),
  })
  .strict()

export type VolunteerSearchResult = z.infer<typeof volunteerSearchResultSchema>

export const volunteerSearchResponseSchema = z
  .object({
    results: z.array(volunteerSearchResultSchema),
  })
  .strict()

export type VolunteerSearchResponse = z.infer<typeof volunteerSearchResponseSchema>
