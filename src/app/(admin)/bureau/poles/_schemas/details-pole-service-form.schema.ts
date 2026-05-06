import { z } from "zod"

export const detailsPoleServiceUpsertSchema = z
  .object({
    title: z.string().min(2, "Le titre doit contenir au moins 2 caractères.").max(80),
    description: z
      .string()
      .min(10, "La description doit contenir au moins 10 caractères.")
      .max(1200, "La description ne peut pas dépasser 1200 caractères.")
      .transform((v) => v.trim()),
    icon: z
      .string()
      .max(8, "L’icône ne peut pas dépasser 8 caractères.")
      .optional()
      .nullable()
      .transform((v) => (v?.trim() ? v.trim() : null)),
    order: z.coerce.number().int("L’ordre doit être un entier.").min(0).default(0),
    isActive: z.coerce.boolean().default(true),
  })
  .strict()

export type DetailsPoleServiceUpsertInput = z.infer<typeof detailsPoleServiceUpsertSchema>

