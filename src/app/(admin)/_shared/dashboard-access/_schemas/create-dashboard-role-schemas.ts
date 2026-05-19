import { z } from "zod"

/**
 * Schémas Zod pour les rôles d’un périmètre dashboard (table `roles`).
 */
export function createDashboardRoleSchemas<const T extends readonly [string, ...string[]]>(
  roleCodes: T,
) {
  const roleCodeSchema = z.enum(roleCodes)

  const roleSchema = z
    .object({
      code: roleCodeSchema,
      labelFr: z.string().min(1),
      description: z.string().nullable(),
      sortOrder: z.number().int(),
    })
    .strict()

  return { roleCodeSchema, roleSchema }
}
