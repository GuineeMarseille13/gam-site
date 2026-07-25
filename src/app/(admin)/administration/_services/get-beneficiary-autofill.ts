import { prisma } from "@/lib/prisma"
import {
  beneficiaryAutofillParamsSchema,
  beneficiaryAutofillSchema,
  type BeneficiaryAutofill,
} from "../_schemas/beneficiary-identity-search.schema"

function toYmd(value: Date): string {
  return value.toISOString().slice(0, 10)
}

/**
 * Service: getBeneficiaryAutofillById
 * Rôle: Données d’identité/comptes pour préremplir l’étape Fiche (admin).
 * Auth: à vérifier par l’appelant.
 */
export async function getBeneficiaryAutofillById(
  rawId: unknown,
): Promise<BeneficiaryAutofill | null> {
  const { id } = beneficiaryAutofillParamsSchema.parse(
    typeof rawId === "string" ? { id: rawId } : rawId,
  )

  const row = await prisma.beneficiary.findUnique({
    where: { id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      birthDate: true,
      birthCountry: true,
      birthMunicipality: true,
      fatherName: true,
      motherName: true,
      phone: true,
      email: true,
      gmailAccount: true,
      gmailPassword: true,
      ekadiLogin: true,
      ekadiPassword: true,
    },
  })

  if (!row) return null

  return beneficiaryAutofillSchema.parse({
    id: row.id,
    firstName: row.firstName.trim(),
    lastName: row.lastName.trim(),
    birthDate: row.birthDate ? toYmd(row.birthDate) : null,
    birthCountry: row.birthCountry?.trim() || null,
    birthMunicipality: row.birthMunicipality?.trim() || null,
    fatherName: row.fatherName?.trim() || null,
    motherName: row.motherName?.trim() || null,
    phone: row.phone?.trim() || null,
    email: row.email?.trim() || null,
    gmailAccount: row.gmailAccount?.trim() || null,
    gmailPassword: row.gmailPassword ?? null,
    ekadiLogin: row.ekadiLogin?.trim() || null,
    ekadiPassword: row.ekadiPassword ?? null,
  })
}
