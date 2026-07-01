import { z } from "zod"
import { adminPageSchema } from "@/app/(admin)/_shared/_schemas/pagination.schema"

export const adherentStatusFilterSchema = z.enum(["tous", "actif", "inactif"])

export const adherentsSearchParamsSchema = z
  .object({
    page: adminPageSchema.optional(),
    q: z
      .string()
      .transform((value) => value.trim())
      .refine((value) => value.length <= 80, "Recherche trop longue")
      .optional(),
    annee: z.coerce.number().int().min(2000).max(2100).optional(),
    statut: adherentStatusFilterSchema.optional(),
  })
  .strict()

export type AdherentsSearchParams = z.infer<typeof adherentsSearchParamsSchema>

export const adherentYearQuerySchema = z.coerce.number().int().min(2000).max(2100)
