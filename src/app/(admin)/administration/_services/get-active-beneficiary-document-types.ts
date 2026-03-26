import { prisma } from "@/lib/prisma"
import { requireAdministrationDashboard } from "@/lib/auth-guard"

export type ActiveBeneficiaryDocumentType = {
  readonly code: string
  readonly label: string
  readonly requiresOtherDetail: boolean
}

/**
 * Documents actifs pour l’étape « Dossier » du formulaire Demande bénéficiaire.
 */
export async function getActiveBeneficiaryDocumentTypes(): Promise<ActiveBeneficiaryDocumentType[]> {
  await requireAdministrationDashboard()

  const rows = await prisma.beneficiaryDocumentType.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { label: "asc" }],
    select: { code: true, label: true, requiresOtherDetail: true },
  })

  return rows
}
