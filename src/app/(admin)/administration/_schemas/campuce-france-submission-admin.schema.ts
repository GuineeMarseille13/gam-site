import { z } from "zod"

/**
 * Ligne liste — dépôts Campus France (consultation Administration).
 */
export const campuceFranceSubmissionAdminRowSchema = z
  .object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.string(),
    country: z.string(),
    acceptanceCity: z.string(),
    universitySite: z.string(),
    academicLevel: z.string(),
    program: z.string(),
    helpTypes: z.array(z.string()),
    visaAppointmentDate: z.string().datetime().nullable(),
    comment: z.string().nullable(),
    filesIds: z.array(z.string()),
    isComplete: z.boolean(),
    hasHostingAttestation: z.boolean(),
    hasHousingFound: z.boolean(),
    hasVisa: z.boolean(),
    createdAt: z.string().datetime(),
  })
  .strict()

export type CampuceFranceSubmissionAdminRow = z.infer<
  typeof campuceFranceSubmissionAdminRowSchema
>
