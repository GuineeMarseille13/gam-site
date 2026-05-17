import type { PrismaClient } from "@/lib/generated/prisma/client"
import { upsertAssociationPostes } from "@/helpers/seed-association-postes"
import { upsertSystemRoles } from "@/helpers/seed-system-roles"

/**
 * Seed postes organisationnels + rôles d’accès. Idempotent.
 */
export async function upsertAssociationRoles(prisma: PrismaClient): Promise<void> {
  await upsertAssociationPostes(prisma)
  await upsertSystemRoles(prisma)
}
