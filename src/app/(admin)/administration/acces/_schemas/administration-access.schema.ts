import { z } from "zod"
import { permanenceAdminRoleCodeSchema } from "./permanence-admin-role.schema"

export const administrationAccessRowSchema = z
  .object({
    userId: z.string().min(1),
    email: z.string().email(),
    name: z.string(),
    role: permanenceAdminRoleCodeSchema,
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
        profileKind: z.string(),
      })
      .nullable(),
  })
  .strict()

export type AdministrationAccessRow = z.infer<typeof administrationAccessRowSchema>

export const createAdministrationAccessSchema = z
  .object({
    personId: z.string().min(1, "Sélectionnez une personne."),
    email: z.string().email("Adresse email invalide."),
    role: permanenceAdminRoleCodeSchema,
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères."),
    confirmPassword: z.string(),
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

export const updateAdministrationAccessSchema = z
  .object({
    role: permanenceAdminRoleCodeSchema,
    email: z.string().email("Adresse email invalide."),
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
