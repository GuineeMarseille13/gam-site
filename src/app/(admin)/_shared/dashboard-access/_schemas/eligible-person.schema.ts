import { z } from "zod"

export const eligiblePersonForDashboardAccessSchema = z
  .object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().nullable(),
    phone: z.string(),
    profileKind: z.string(),
    posteLabel: z.string().nullable(),
  })
  .strict()

export type EligiblePersonForDashboardAccess = z.infer<
  typeof eligiblePersonForDashboardAccessSchema
>
