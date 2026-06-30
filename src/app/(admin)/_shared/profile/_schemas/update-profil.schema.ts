import { z } from "zod"

export const updateProfilSchema = z
  .object({
    firstName: z.string().trim().min(1, "Le prénom est requis."),
    lastName: z.string().trim().min(1, "Le nom est requis."),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Adresse email invalide."),
    phone: z.string().trim(),
    removeImage: z.boolean().optional(),
  })
  .strict()

export type UpdateProfilInput = z.infer<typeof updateProfilSchema>
