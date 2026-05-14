import { z } from "zod"

const activityReportUploadMetaRowSchema = z
  .object({
    year: z.number().int().min(2000).max(2100),
    label: z
      .string()
      .max(200, "Le titre affiché ne peut pas dépasser 200 caractères.")
      .transform((v) => v.trim())
      .pipe(z.string().min(1, "Le titre affiché est obligatoire.")),
  })
  .strict()

/**
 * Métadonnées (JSON) pour un lot d'uploads : ordre aligné avec les fichiers `files` du FormData.
 */
export const activityReportsUploadMetadataSchema = z
  .array(activityReportUploadMetaRowSchema)
  .min(1, "Au moins un rapport est requis.")
  .max(15, "Maximum 15 rapports par envoi.")
  .superRefine((rows, ctx) => {
    const years = rows.map((r) => r.year)
    if (new Set(years).size !== years.length) {
      ctx.addIssue({
        code: "custom",
        message: "Chaque année ne doit apparaître qu'une seule fois dans le même envoi.",
        path: [],
      })
    }
  })

export type ActivityReportUploadMetaRow = z.infer<typeof activityReportUploadMetaRowSchema>
