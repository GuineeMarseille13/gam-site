import { z } from "zod"

/**
 * Schéma: DetailsPoleService (dashboard)
 * Rôle: Validation runtime des services d’un pôle (table `details_pole_services`).
 */
export const detailsPoleServiceSchema = z
  .object({
    id: z.string().min(1),
    detailsPoleId: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    icon: z.string().optional().nullable(),
    order: z.number().int(),
    isActive: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .strict()

export type DetailsPoleService = z.infer<typeof detailsPoleServiceSchema>

export const detailsPoleServiceListSchema = detailsPoleServiceSchema.array()

