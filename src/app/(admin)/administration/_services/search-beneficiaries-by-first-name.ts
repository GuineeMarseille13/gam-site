import { prisma } from "@/lib/prisma"
import {
  BENEFICIARY_IDENTITY_SEARCH_MAX_RESULTS,
  beneficiaryIdentitySearchHitSchema,
  beneficiaryIdentitySearchQuerySchema,
  type BeneficiaryIdentitySearchHit,
} from "../_schemas/beneficiary-identity-search.schema"

function normalizePart(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ")
}

function toYmd(value: Date): string {
  return value.toISOString().slice(0, 10)
}

function identityKey(hit: {
  firstName: string
  lastName: string
  birthDate: string | null
  phone: string | null
}): string {
  return [
    normalizePart(hit.firstName),
    normalizePart(hit.lastName),
    hit.birthDate ?? "",
    hit.phone ? normalizePart(hit.phone) : "",
  ].join("|")
}

/**
 * Service: searchBeneficiariesByFirstName
 * Rôle: Suggestions de fiches connues (dédupliquées, plus récentes d’abord).
 * Auth: à vérifier par l’appelant.
 */
export async function searchBeneficiariesByFirstName(
  rawQuery: unknown,
): Promise<BeneficiaryIdentitySearchHit[]> {
  const { q } = beneficiaryIdentitySearchQuerySchema.parse(
    typeof rawQuery === "string" ? { q: rawQuery } : rawQuery,
  )

  const rows = await prisma.beneficiary.findMany({
    where: {
      firstName: { contains: q, mode: "insensitive" },
    },
    orderBy: { createdAt: "desc" },
    take: 80,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      birthDate: true,
      phone: true,
      email: true,
    },
  })

  const seen = new Set<string>()
  const results: BeneficiaryIdentitySearchHit[] = []

  for (const row of rows) {
    const birthDate = row.birthDate ? toYmd(row.birthDate) : null
    const phone = row.phone?.trim() || null
    const email = row.email?.trim() || null
    const firstName = row.firstName.trim()
    const lastName = row.lastName.trim()
    const key = identityKey({ firstName, lastName, birthDate, phone })

    if (seen.has(key)) continue
    seen.add(key)

    results.push(
      beneficiaryIdentitySearchHitSchema.parse({
        id: row.id,
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`.trim(),
        birthDate,
        phone,
        email,
      }),
    )

    if (results.length >= BENEFICIARY_IDENTITY_SEARCH_MAX_RESULTS) break
  }

  return results
}
