import { z } from "zod"

export const BENEFICIARY_IDENTITY_SEARCH_MIN_LENGTH = 3
export const BENEFICIARY_IDENTITY_SEARCH_MAX_RESULTS = 12

/**
 * Paramètre de recherche de bénéficiaires par prénom.
 */
export const beneficiaryIdentitySearchQuerySchema = z
  .object({
    q: z
      .string()
      .trim()
      .min(
        BENEFICIARY_IDENTITY_SEARCH_MIN_LENGTH,
        `Saisissez au moins ${BENEFICIARY_IDENTITY_SEARCH_MIN_LENGTH} lettres.`,
      )
      .max(80),
  })
  .strict()

export type BeneficiaryIdentitySearchQuery = z.infer<
  typeof beneficiaryIdentitySearchQuerySchema
>

/**
 * Suggestion affichée (sans mots de passe).
 */
export const beneficiaryIdentitySearchHitSchema = z
  .object({
    id: z.string().min(1),
    firstName: z.string().min(1).max(80),
    lastName: z.string().min(1).max(80),
    fullName: z.string().min(1).max(160),
    birthDate: z.string().nullable(),
    phone: z.string().nullable(),
    email: z.string().nullable(),
  })
  .strict()

export type BeneficiaryIdentitySearchHit = z.infer<
  typeof beneficiaryIdentitySearchHitSchema
>

export const beneficiaryIdentitySearchResponseSchema = z
  .object({
    results: z.array(beneficiaryIdentitySearchHitSchema),
  })
  .strict()

/**
 * Payload d’autofill complet (admin) — inclut les identifiants sensibles.
 */
export const beneficiaryAutofillSchema = z
  .object({
    id: z.string().min(1),
    firstName: z.string().min(1).max(80),
    lastName: z.string().min(1).max(80),
    birthDate: z.string().nullable(),
    birthCountry: z.string().nullable(),
    birthMunicipality: z.string().nullable(),
    fatherName: z.string().nullable(),
    motherName: z.string().nullable(),
    phone: z.string().nullable(),
    email: z.string().nullable(),
    gmailAccount: z.string().nullable(),
    gmailPassword: z.string().nullable(),
    ekadiLogin: z.string().nullable(),
    ekadiPassword: z.string().nullable(),
  })
  .strict()

export type BeneficiaryAutofill = z.infer<typeof beneficiaryAutofillSchema>

export const beneficiaryAutofillParamsSchema = z
  .object({
    id: z.string().min(1),
  })
  .strict()
