import { prisma } from "@/lib/prisma"
import { PERMANENCE_ADMIN_ROLE_CODES } from "@/config/system-roles"
import {
  permanenceAdminRoleSchema,
  type PermanenceAdminRole,
} from "../_schemas/permanence-admin-role.schema"

/**
 * Rôles permanence administrative actifs (table `roles`), triés pour les formulaires.
 */
export async function getPermanenceAdminRoles(): Promise<PermanenceAdminRole[]> {
  const rows = await prisma.role.findMany({
    where: {
      code: { in: [...PERMANENCE_ADMIN_ROLE_CODES] },
      isActive: true,
    },
    orderBy: { sortOrder: "asc" },
    select: {
      code: true,
      labelFr: true,
      description: true,
      sortOrder: true,
    },
  })

  return rows.map((row) =>
    permanenceAdminRoleSchema.parse({
      code: row.code,
      labelFr: row.labelFr,
      description: row.description,
      sortOrder: row.sortOrder,
    }),
  )
}
