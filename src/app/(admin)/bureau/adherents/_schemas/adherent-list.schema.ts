import { z } from "zod"

/**
 * Ligne liste adhérents (personne ayant au moins une cotisation enregistrée).
 */
export const adherentListRowSchema = z
  .object({
    personId: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().nullable(),
    phone: z.string(),
    image: z.string().nullable(),
    membershipCount: z.number().int().nonnegative(),
    /** Année civile la plus récente parmi les cotisations */
    latestYear: z.number().int(),
    /** Date de création de la cotisation la plus récente (paiement enregistré) */
    latestMembershipCreatedAt: z.string(),
    /** Au moins une cotisation marquée active */
    hasActiveMembership: z.boolean(),
    /** Années distinctes présentes, tri décroissant */
    years: z.array(z.number().int()),
  })
  .strict()

export type AdherentListRow = z.infer<typeof adherentListRowSchema>

export const adherentListRowsSchema = adherentListRowSchema.array()
