import { prisma } from "@/lib/prisma"
import { requireAdministrationDashboard } from "@/lib/auth-guard"
import {
  beneficiaryDocumentTypeRowSchema,
  type BeneficiaryDocumentTypeRow,
} from "../_schemas/beneficiary-document-type.schema"
import { countBeneficiariesWithDocumentCode } from "./count-beneficiaries-with-document-code"

/**
 * Types de documents + usage dans les fiches (administration).
 */
export async function getBeneficiaryDocumentTypesAdmin(): Promise<BeneficiaryDocumentTypeRow[]> {
  await requireAdministrationDashboard()

  const types = await prisma.beneficiaryDocumentType.findMany({
    orderBy: [{ sortOrder: "asc" }, { label: "asc" }],
  })

  const usage = await Promise.all(types.map((t) => countBeneficiariesWithDocumentCode(t.code)))

  return types.map((t, i) =>
    beneficiaryDocumentTypeRowSchema.parse({
      id: t.id,
      code: t.code,
      label: t.label,
      sortOrder: t.sortOrder,
      requiresOtherDetail: t.requiresOtherDetail,
      isActive: t.isActive,
      usageCount: usage[i] ?? 0,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    }),
  )
}
