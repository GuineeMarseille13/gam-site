import { z } from "zod"
import { PERMANENCE_ADMIN_ROLE_CODES } from "@/config/system-roles"

export const permanenceAdminRoleSchema = z
  .object({
    code: z.enum(PERMANENCE_ADMIN_ROLE_CODES),
    labelFr: z.string().min(1),
    description: z.string().nullable(),
    sortOrder: z.number().int(),
  })
  .strict()

export type PermanenceAdminRole = z.infer<typeof permanenceAdminRoleSchema>

export const permanenceAdminRoleCodeSchema = z.enum(PERMANENCE_ADMIN_ROLE_CODES)
