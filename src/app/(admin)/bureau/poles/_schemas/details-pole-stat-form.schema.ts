import { z } from "zod"

/**
 * Schéma: formulaire d’édition d’une stat.
 * Note: utilisé côté client (safeParse) et côté API (parse).
 */
export const detailsPoleStatUpsertSchema = z
  .object({
    label: z.string().min(2, "Le libellé doit contenir au moins 2 caractères.").max(80),
    value: z.coerce.number().int("La valeur doit être un entier."),
    unit: z
      .string()
      .max(32, "L’unité ne peut pas dépasser 32 caractères.")
      .optional()
      .nullable()
      .transform((v) => (v?.trim() ? v.trim() : null)),
    helperText: z
      .string()
      .max(140, "Le texte d’aide ne peut pas dépasser 140 caractères.")
      .optional()
      .nullable()
      .transform((v) => (v?.trim() ? v.trim() : null)),
    order: z.coerce.number().int("L’ordre doit être un entier.").min(0).default(0),
    isActive: z.coerce.boolean().default(true),
  })
  .strict()

export type DetailsPoleStatUpsertInput = z.infer<typeof detailsPoleStatUpsertSchema>

