import { z } from "zod"

export const changeOwnPasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Veuillez saisir votre mot de passe actuel."),
    newPassword: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères."),
  })
  .strict()

export type ChangeOwnPasswordInput = z.infer<typeof changeOwnPasswordSchema>
