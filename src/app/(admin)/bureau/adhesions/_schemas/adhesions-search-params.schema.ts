import { z } from "zod"
import { adminPageSchema } from "@/app/(admin)/_shared/_schemas/pagination.schema"

export const adhesionsSearchParamsSchema = z
  .object({
    annee: z.coerce.number().int().min(2000).max(2100).optional(),
    q: z
      .string()
      .transform((value) => value.trim())
      .refine((value) => value.length <= 80, "Recherche trop longue")
      .optional(),
    page: adminPageSchema.optional(),
  })
  .strict()

export type AdhesionsSearchParams = z.infer<typeof adhesionsSearchParamsSchema>

