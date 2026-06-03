import { z } from "zod"

/**
 * Métadonnées (JSON) pour la modification d’un rapport existant.
 * Le fichier PDF est optionnel dans le FormData (`file`) : s’il est absent, l’URL en base est conservée.
 */
export const updateActivityReportMetadataSchema = z
  .object({
    id: z.string().min(1, "Identifiant du rapport manquant."),
    year: z.number().int().min(2000).max(2100),
    label: z
      .string()
      .max(200, "Le titre affiché ne peut pas dépasser 200 caractères.")
      .transform((v) => v.trim())
      .pipe(z.string().min(1, "Le titre affiché est obligatoire.")),
  })
  .strict()

export type UpdateActivityReportMetadata = z.infer<typeof updateActivityReportMetadataSchema>
