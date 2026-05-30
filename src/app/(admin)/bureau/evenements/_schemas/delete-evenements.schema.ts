import { z } from "zod"

export const deleteEvenementsSchema = z
  .object({
    ids: z
      .array(z.string().min(1, "Identifiant invalide"))
      .min(1, "Sélectionnez au moins un événement"),
  })
  .strict()

export type DeleteEvenementsInput = z.infer<typeof deleteEvenementsSchema>
