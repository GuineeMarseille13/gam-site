import { z } from "zod"

/**
 * Schéma: DetailsPoleStat
 * Rôle: Validation runtime des stats d’un pôle (table `details_pole_stats`).
 */
export const detailsPoleStatSchema = z
  .object({
    id: z.string().min(1),
    detailsPoleId: z.string().min(1),
    label: z.string().min(1, "Le libellé est requis."),
    value: z.number().int("La valeur doit être un entier."),
    unit: z.string().max(32, "L’unité ne peut pas dépasser 32 caractères.").optional().nullable(),
    helperText: z
      .string()
      .max(140, "Le texte d’aide ne peut pas dépasser 140 caractères.")
      .optional()
      .nullable(),
    order: z.number().int(),
    isActive: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .strict()

export type DetailsPoleStat = z.infer<typeof detailsPoleStatSchema>

export const detailsPoleStatListSchema = detailsPoleStatSchema.array()

