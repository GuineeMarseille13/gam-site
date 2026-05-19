import { z } from "zod"
import { HERBERGEMENT_RELATION_ROLE_CODES } from "@/config/system-roles"

export const herbergementRelationRoleSchema = z
  .object({
    code: z.enum(HERBERGEMENT_RELATION_ROLE_CODES),
    labelFr: z.string().min(1),
    description: z.string().nullable(),
    sortOrder: z.number().int(),
  })
  .strict()

export type HerbergementRelationRole = z.infer<typeof herbergementRelationRoleSchema>

export const herbergementRelationRoleCodeSchema = z.enum(HERBERGEMENT_RELATION_ROLE_CODES)
