import { z } from "zod"

/**
 * Création d'un compte dashboard rôle « administration » + fiche Person liée.
 */
export const createAdministrationAccountSchema = z
  .object({
    firstName: z.string().min(1, "Le prénom est requis.").max(120),
    lastName: z.string().min(1, "Le nom est requis.").max(120),
    email: z.string().email("Adresse email invalide."),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères."),
    confirmPassword: z.string(),
    phone: z.string().min(1, "Le téléphone est requis.").max(40),
    description: z.string().max(2000).optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Les mots de passe ne correspondent pas.",
        path: ["confirmPassword"],
      })
    }
  })

export type CreateAdministrationAccountInput = z.infer<typeof createAdministrationAccountSchema>
