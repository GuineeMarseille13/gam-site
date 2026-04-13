import { z } from "zod"

export const avisIdParamsSchema = z.object({
  id: z.string().min(1, "Identifiant manquant"),
})

export type AvisIdParams = z.infer<typeof avisIdParamsSchema>
