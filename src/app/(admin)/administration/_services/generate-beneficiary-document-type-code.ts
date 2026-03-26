import { prisma } from "@/lib/prisma"

function baseCodeFromLabel(label: string): string {
  const normalized = label
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
  const base = normalized.slice(0, 40)
  return base.length > 0 ? base : "DOCUMENT"
}

/**
 * Génère un `code` unique (stable côté JSON) à partir du libellé saisi.
 */
export async function generateBeneficiaryDocumentTypeCode(label: string): Promise<string> {
  const base = baseCodeFromLabel(label)
  let candidate = base
  let n = 2
  for (;;) {
    const exists = await prisma.beneficiaryDocumentType.findUnique({
      where: { code: candidate },
      select: { id: true },
    })
    if (!exists) {
      return candidate
    }
    candidate = `${base}_${n}`
    n += 1
  }
}
