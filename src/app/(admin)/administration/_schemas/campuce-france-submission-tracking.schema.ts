import { z } from "zod"

export const campuceFranceSubmissionTrackingSchema = z
  .object({
    submissionId: z.string().min(1, "Identifiant dossier manquant."),
    isComplete: z.boolean(),
    hasHostingAttestation: z.boolean(),
    hasHousingFound: z.boolean(),
    hasVisa: z.boolean(),
  })
  .strict()

export type CampuceFranceSubmissionTrackingInput = z.infer<
  typeof campuceFranceSubmissionTrackingSchema
>

