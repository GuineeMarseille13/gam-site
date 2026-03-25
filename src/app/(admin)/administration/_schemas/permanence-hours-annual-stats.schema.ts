import { z } from "zod"

const CURRENT_YEAR = new Date().getFullYear()

/**
 * Paramètre d’URL `annee` pour les stats permanence (défaut : année civile en cours).
 */
export const permanenceStatsYearParamSchema = z
  .union([z.string(), z.undefined()])
  .transform((s) => {
    if (s == null || s === "") return CURRENT_YEAR
    const n = Number.parseInt(s, 10)
    if (Number.isNaN(n)) return CURRENT_YEAR
    return n
  })
  .pipe(z.number().int().min(2020, "Année minimale : 2020.").max(CURRENT_YEAR, "Année hors plage."))

export type PermanenceStatsYear = z.infer<typeof permanenceStatsYearParamSchema>

/**
 * Une ligne : total d’heures de permanence ADM pour un membre sur une année donnée.
 */
export const permanenceVolunteerAnnualHoursRowSchema = z
  .object({
    memberFullName: z.string(),
    totalHours: z.number(),
  })
  .strict()

export type PermanenceVolunteerAnnualHoursRow = z.infer<
  typeof permanenceVolunteerAnnualHoursRowSchema
>

export const permanenceVolunteerAnnualHoursListSchema = z.array(permanenceVolunteerAnnualHoursRowSchema)

/**
 * Requête pour le détail d’un membre sur une année (server action).
 */
export const permanenceVolunteerYearDetailQuerySchema = z
  .object({
    year: z.number().int().min(2020).max(CURRENT_YEAR),
    memberFullName: z.string().min(1, "Membre requis.").max(200),
  })
  .strict()

export type PermanenceVolunteerYearDetailQuery = z.infer<typeof permanenceVolunteerYearDetailQuerySchema>

/**
 * Une saisie individuelle (détail annuel par membre).
 */
export const permanenceVolunteerYearDetailRowSchema = z
  .object({
    id: z.string(),
    permanenceDate: z.string(),
    hours: z.number(),
    comment: z.string().nullable(),
    createdAt: z.string(),
  })
  .strict()

export type PermanenceVolunteerYearDetailRow = z.infer<typeof permanenceVolunteerYearDetailRowSchema>
