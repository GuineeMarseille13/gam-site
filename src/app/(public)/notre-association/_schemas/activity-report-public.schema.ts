import { z } from "zod"

/**
 * Données exposées au site public pour un rapport d'activité (PDF par année).
 */
export const activityReportPublicSchema = z
  .object({
    id: z.string().min(1),
    year: z.number().int().min(2000).max(2100),
    label: z.string().nullable().optional(),
    pdfUrl: z.string().url(),
  })
  .strip()

export const activityReportsPublicListSchema = z.array(activityReportPublicSchema)

export type ActivityReportPublic = z.infer<typeof activityReportPublicSchema>
