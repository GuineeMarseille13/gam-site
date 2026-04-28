import { z } from "zod"

export const campuceFranceAttachmentDeleteSchema = z
  .object({
    submissionId: z.string().min(1, "Identifiant dossier manquant."),
    publicId: z
      .string()
      .min(1, "Identifiant fichier manquant.")
      .refine((value) => value.startsWith("gam/campuce-france/"), {
        message: "Identifiant fichier invalide.",
      }),
  })
  .strict()

export type CampuceFranceAttachmentDeleteInput = z.infer<
  typeof campuceFranceAttachmentDeleteSchema
>

