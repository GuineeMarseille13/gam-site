import type { PrismaClient } from "@/lib/generated/prisma/client"
import { SYSTEM_ROLES_SEED } from "@/config/system-roles"

/**
 * Upsert des lignes Role (rôles d’accès). Idempotent pour seed / déploiements.
 */
export async function upsertSystemRoles(prisma: PrismaClient): Promise<void> {
  for (const row of SYSTEM_ROLES_SEED) {
    await prisma.role.upsert({
      where: { code: row.code },
      create: {
        code: row.code,
        labelFr: row.labelFr,
        description: row.description,
        sortOrder: row.sortOrder,
      },
      update: {
        labelFr: row.labelFr,
        description: row.description,
        sortOrder: row.sortOrder,
      },
    })
  }
}
