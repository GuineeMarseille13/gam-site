import { prisma } from "@/lib/prisma"

/**
 * Nombre de fiches dont le JSON `documentsProvided` contient ce `code`.
 */
export async function countBeneficiariesWithDocumentCode(code: string): Promise<number> {
  const fragment = JSON.stringify([code])
  const rows = await prisma.$queryRaw<[{ count: bigint }]>`
    SELECT COUNT(*)::bigint AS count
    FROM "beneficiaries"
    WHERE "documentsProvided" IS NOT NULL
      AND "documentsProvided"::jsonb @> ${fragment}::jsonb
  `
  const n = rows[0]?.count
  return n == null ? 0 : Number(n)
}
