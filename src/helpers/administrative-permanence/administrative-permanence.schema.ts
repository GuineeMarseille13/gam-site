import { z } from "zod"

/** Accepte HH:mm ou HH:mm:ss (navigateurs) et normalise en HH:mm. */
export const timeHmSchema = z
  .string()
  .transform((s) => (s.length >= 5 ? s.slice(0, 5) : s))
  .pipe(
    z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Format attendu : HH:mm (ex. 14:00)."),
  )

/** Création : pas d’id. Édition : `id` obligatoire pour modifier l’enregistrement existant (évite un doublon si la date affichée diverge du fuseau). */
export const saveAdministrativePermanenceSlotInputSchema = z
  .object({
    id: z.string().min(1).max(128).optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide (AAAA-MM-JJ)."),
    startTime: timeHmSchema,
    endTime: timeHmSchema,
  })
  .strict()
  .refine((v) => v.endTime > v.startTime, {
    message: "L’heure de fin doit être après l’heure de début.",
    path: ["endTime"],
  })

export const deleteAdministrativePermanenceSlotInputSchema = z
  .object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  })
  .strict()

export const administrativePermanenceSettingsInputSchema = z
  .object({
    horairesCardText: z.union([z.string().max(2000), z.null()]),
  })
  .strict()

export const administrativePermanenceSlotRowSchema = z
  .object({
    id: z.string(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    startTime: timeHmSchema,
    endTime: timeHmSchema,
  })
  .strict()

export const administrativePermanenceSlotListSchema = z.array(
  administrativePermanenceSlotRowSchema,
)

export type AdministrativePermanenceSlotRow = z.infer<
  typeof administrativePermanenceSlotRowSchema
>
