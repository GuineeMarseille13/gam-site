import { z } from "zod"

/**
 * Ligne liste : comptes rôle `administration` + fiche Person optionnelle.
 */
export const administrationAccessRowSchema = z
  .object({
    userId: z.string().min(1),
    email: z.string().email(),
    name: z.string(),
    banned: z.boolean(),
    createdAt: z.string(),
    person: z
      .object({
        id: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        phone: z.string(),
        email: z.string().nullable().optional(),
        image: z.string().nullable().optional(),
        description: z.string().nullable().optional(),
      })
      .nullable(),
  })
  .strict()

export type AdministrationAccessRow = z.infer<typeof administrationAccessRowSchema>

/**
 * Mise à jour d’un accès administration (admin uniquement).
 * Mot de passe : laisser vide pour ne pas changer.
 */
export const updateAdministrationAccessSchema = z
  .object({
    firstName: z.string().min(1, "Le prénom est requis.").max(120),
    lastName: z.string().min(1, "Le nom est requis.").max(120),
    email: z.string().email("Adresse email invalide."),
    phone: z.string().min(1, "Le téléphone est requis.").max(40),
    description: z.string().max(2000).optional(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    const hasPwd = (data.password?.length ?? 0) > 0
    const hasConfirm = (data.confirmPassword?.length ?? 0) > 0
    if (hasPwd !== hasConfirm) {
      ctx.addIssue({
        code: "custom",
        message: "Confirmez le mot de passe.",
        path: ["confirmPassword"],
      })
      return
    }
    if (hasPwd && (data.password?.length ?? 0) < 8) {
      ctx.addIssue({
        code: "custom",
        message: "Le mot de passe doit contenir au moins 8 caractères.",
        path: ["password"],
      })
    }
    if (hasPwd && data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Les mots de passe ne correspondent pas.",
        path: ["confirmPassword"],
      })
    }
  })

export type UpdateAdministrationAccessInput = z.infer<typeof updateAdministrationAccessSchema>
