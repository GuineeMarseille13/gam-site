import { z } from "zod"
import { SYSTEM_ROLES_SEED } from "@/config/system-roles"

const roleCodes = SYSTEM_ROLES_SEED.map((r) => r.code) as [string, ...string[]]

export const dashboardAccessRoleSchema = z.enum(roleCodes)

export const dashboardAccessRowSchema = z
  .object({
    userId: z.string().min(1),
    email: z.string().email(),
    name: z.string(),
    role: dashboardAccessRoleSchema,
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

export type DashboardAccessRow = z.infer<typeof dashboardAccessRowSchema>

export const createDashboardAccessSchema = z
  .object({
    personId: z.string().min(1, "Sélectionnez une personne."),
    email: z.string().email("Adresse email invalide."),
    role: dashboardAccessRoleSchema,
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

export const updateDashboardAccessSchema = z
  .object({
    role: dashboardAccessRoleSchema,
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
