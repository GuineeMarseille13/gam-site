import { z } from "zod"

/**
 * Schéma: réalisation publique d’un pôle
 * Rôle: validation runtime des cartes « Nos réalisations » sur `/poles/[slug]`.
 */
export const detailsPoleAchievementPublicSchema = z
  .object({
    url: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
  })
  .strict()

export type DetailsPoleAchievementPublic = z.infer<
  typeof detailsPoleAchievementPublicSchema
>

export const detailsPoleAchievementPublicListSchema =
  detailsPoleAchievementPublicSchema.array()
