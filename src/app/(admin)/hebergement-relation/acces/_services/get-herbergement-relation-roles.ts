import { prisma } from "@/lib/prisma"
import { HERBERGEMENT_RELATION_ROLE_CODES } from "@/config/system-roles"
import {
  herbergementRelationRoleSchema,
  type HerbergementRelationRole,
} from "../_schemas/herbergement-relation-role.schema"

/**
 * Rôles hébergement actifs (table `roles`), triés pour les formulaires.
 */
export async function getHerbergementRelationRoles(): Promise<HerbergementRelationRole[]> {
  const rows = await prisma.role.findMany({
    where: {
      code: { in: [...HERBERGEMENT_RELATION_ROLE_CODES] },
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
    herbergementRelationRoleSchema.parse({
      code: row.code,
      labelFr: row.labelFr,
      description: row.description,
      sortOrder: row.sortOrder,
    }),
  )
}
