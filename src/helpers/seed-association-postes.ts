import type { PrismaClient } from "@/lib/generated/prisma/client"
import { ASSOCIATION_POSTES_SEED } from "@/config/association-postes"

/**
 * Upsert des lignes Poste (codes stables). Idempotent pour seed / déploiements.
 */
export async function upsertAssociationPostes(prisma: PrismaClient): Promise<void> {
  for (const row of ASSOCIATION_POSTES_SEED) {
    await prisma.poste.upsert({
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
