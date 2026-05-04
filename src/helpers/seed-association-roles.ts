import type { PrismaClient } from "@/lib/generated/prisma/client"
import { ASSOCIATION_ROLES_SEED } from "@/config/association-roles"

/**
 * Upsert des lignes Role (codes stables). Idempotent pour seed / déploiements.
 */
export async function upsertAssociationRoles(prisma: PrismaClient): Promise<void> {
  for (const row of ASSOCIATION_ROLES_SEED) {
    await prisma.role.upsert({
      where: { code: row.code },
      create: {
        code: row.code,
        labelFr: row.labelFr,
        sortOrder: row.sortOrder,
      },
      update: {
        labelFr: row.labelFr,
        sortOrder: row.sortOrder,
      },
    })
  }
}
