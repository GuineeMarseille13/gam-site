import { z } from "zod"

/**
 * Payload pour activer / désactiver l’affichage d’un rapport sur le site public.
 */
export const setActivityReportPublishedSchema = z
  .object({
    id: z.string().min(1, "Identifiant invalide."),
    isPublished: z.boolean(),
  })
  .strict()

export type SetActivityReportPublishedInput = z.infer<typeof setActivityReportPublishedSchema>
