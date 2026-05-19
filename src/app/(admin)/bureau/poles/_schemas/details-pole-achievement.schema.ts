import { z } from "zod"

/**
 * Schéma: DetailsPoleAchievement (dashboard)
 * Rôle: Validation runtime des réalisations d’un pôle.
 */
export const detailsPoleAchievementSchema = z
  .object({
    id: z.string().min(1),
    detailsPoleId: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    imageUrl: z.string().min(1),
    order: z.number().int(),
    isActive: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .strict()

export type DetailsPoleAchievement = z.infer<typeof detailsPoleAchievementSchema>

export const detailsPoleAchievementListSchema = detailsPoleAchievementSchema.array()
