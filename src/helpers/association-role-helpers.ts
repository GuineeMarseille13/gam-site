import type { PrismaClient } from "@/lib/generated/prisma/client"

/**
 * Résout l’id technique Role à partir du code métier (ex. PRESIDENT).
 */
export async function getRoleIdByCode(
  prisma: PrismaClient,
  code: string,
): Promise<string | null> {
  const row = await prisma.role.findUnique({
    where: { code },
    select: { id: true },
  })
  return row?.id ?? null
}
