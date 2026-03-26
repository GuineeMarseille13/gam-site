import { prisma } from "@/lib/prisma"
import { requireAdministrationDashboard } from "@/lib/auth-guard"

export type ActiveBeneficiaryDemandType = {
  readonly id: string
  readonly label: string
  readonly requiresDetail: boolean
}

/**
 * Types de demande actifs pour le formulaire de suivi (ordre d’affichage).
 */
export async function getActiveBeneficiaryDemandTypes(): Promise<ActiveBeneficiaryDemandType[]> {
  await requireAdministrationDashboard()

  const rows = await prisma.beneficiaryDemandType.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { label: "asc" }],
    select: { id: true, label: true, requiresDetail: true },
  })

  return rows
}
