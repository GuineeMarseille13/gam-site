import type { PrismaClient } from "@/lib/generated/prisma/client"

/**
 * Résout l’id technique Poste à partir du code métier (ex. PRESIDENT).
 */
export async function getPosteIdByCode(
  prisma: PrismaClient,
  code: string,
): Promise<string | null> {
  const row = await prisma.poste.findUnique({
    where: { code },
    select: { id: true },
  })
  return row?.id ?? null
}
