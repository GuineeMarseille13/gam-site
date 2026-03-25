import { z } from "zod"

/**
 * Membres proposés dans l’ancien Google Form « Permanence Admin_Bénévole ».
 * Toute évolution de liste se fait ici (et éventuellement migration des anciennes lignes).
 */
export const ADMIN_PERMANENCE_MEMBERS = [
  "Mody Hady BARRY",
  "Moussa CAMARA",
  "Aboubacar sidig Diallo",
  "Mamadou Alpha Diallo",
  "Jafar BARRY",
  "Aicha Kourouma",
  "Michelle Dao",
  "Julie Delaby",
  "Ibrahim BAH",
  "Aminata FOFANA",
  "Anna LUDMANN",
  "Sékou II SAMOURA",
  "mouctar Kaba",
] as const

export type AdminPermanenceMember = (typeof ADMIN_PERMANENCE_MEMBERS)[number]

const MEMBER_SET = new Set<string>(ADMIN_PERMANENCE_MEMBERS)

export const adminPermanenceMemberSchema = z
  .string()
  .refine((v): v is AdminPermanenceMember => MEMBER_SET.has(v), {
    message: "Choisissez un membre dans la liste.",
  })

export const submitPermanenceAdminPresenceVolunteerSchema = z
  .object({
    permanenceDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide.")
      .refine((s) => !Number.isNaN(Date.parse(s)), { message: "Date invalide." }),
    memberFullName: adminPermanenceMemberSchema,
    hours: z
      .number()
      .positive("La durée doit être positive.")
      .max(24, "Maximum 24 heures."),
    comment: z
      .string()
      .max(2000, "Commentaire trop long.")
      .optional()
      .transform((s) => {
        const t = s?.trim()
        return t === "" || t === undefined ? undefined : t
      }),
  })
  .strict()

export type SubmitPermanenceAdminPresenceVolunteerInput = z.infer<
  typeof submitPermanenceAdminPresenceVolunteerSchema
>

/** Validation par étape du wizard (UI). */
export const permanenceAdminPresenceVolunteerStep1Schema = z
  .object({
    permanenceDate: submitPermanenceAdminPresenceVolunteerSchema.shape.permanenceDate,
  })
  .strict()

export const permanenceAdminPresenceVolunteerStep2Schema = z
  .object({
    memberFullName: adminPermanenceMemberSchema,
  })
  .strict()

export const permanenceAdminPresenceVolunteerStep3Schema = z
  .object({
    hours: submitPermanenceAdminPresenceVolunteerSchema.shape.hours,
  })
  .strict()

export const permanenceAdminPresenceVolunteerRowSchema = z
  .object({
    id: z.string(),
    permanenceDate: z.string(),
    memberFullName: z.string(),
    hours: z.number(),
    comment: z.string().nullable(),
    createdAt: z.string(),
  })
  .strict()

export type PermanenceAdminPresenceVolunteerRow = z.infer<
  typeof permanenceAdminPresenceVolunteerRowSchema
>
