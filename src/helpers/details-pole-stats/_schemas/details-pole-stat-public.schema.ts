import { z } from "zod"

/**
 * Schéma: stat publique d’un pôle
 * Rôle: validation runtime des cartes "Statistiques" affichées sur `/poles/[slug]`.
 */
export const detailsPoleStatPublicSchema = z
  .object({
    value: z.number().int(),
    label: z.string().min(1),
    description: z.string().optional(),
  })
  .strict()

export type DetailsPoleStatPublic = z.infer<typeof detailsPoleStatPublicSchema>

export const detailsPoleStatPublicListSchema = detailsPoleStatPublicSchema.array()

