import { prisma } from "@/lib/prisma"
import type { DashboardAccessScope } from "@/config/dashboard-access-scope"
import type { z } from "zod"

/**
 * Rôles actifs du périmètre (table `roles`), triés pour les formulaires.
 */
export async function getDashboardAccessRoles(
  scope: DashboardAccessScope,
): Promise<z.infer<typeof scope.roleSchemas.roleSchema>[]> {
  const rows = await prisma.role.findMany({
    where: {
      code: { in: [...scope.roleCodes] },
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
    scope.roleSchemas.roleSchema.parse({
      code: scope.roleSchemas.roleCodeSchema.parse(row.code),
      labelFr: row.labelFr,
      description: row.description,
      sortOrder: row.sortOrder,
    }),
  )
}
