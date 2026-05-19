import { z } from "zod"

const imageUrlSchema = z
  .string()
  .min(1, "L’image est obligatoire.")
  .max(2048)
  .refine(
    (v) =>
      v.startsWith("http://") ||
      v.startsWith("https://") ||
      v.startsWith("/"),
    "URL d’image invalide.",
  )

export const detailsPoleAchievementUpsertSchema = z
  .object({
    title: z.string().min(2, "Le titre doit contenir au moins 2 caractères.").max(80),
    description: z
      .string()
      .min(10, "La description doit contenir au moins 10 caractères.")
      .max(1200, "La description ne peut pas dépasser 1200 caractères.")
      .transform((v) => v.trim()),
    imageUrl: imageUrlSchema,
    order: z.coerce.number().int("L’ordre doit être un entier.").min(0).default(0),
    isActive: z.coerce.boolean().default(true),
  })
  .strict()

export type DetailsPoleAchievementUpsertInput = z.infer<
  typeof detailsPoleAchievementUpsertSchema
>
