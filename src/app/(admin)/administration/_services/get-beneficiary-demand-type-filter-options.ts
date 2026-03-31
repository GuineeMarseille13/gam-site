import { prisma } from "@/lib/prisma"
import { requireAdministrationDashboard } from "@/lib/auth-guard"
import {
  beneficiaryDemandTypeFilterOptionSchema,
  type BeneficiaryDemandTypeFilterOption,
} from "../_schemas/beneficiary-demand-type.schema"

/**
 * Libellés des types de demande pour alimenter le filtre « Suivi demande » (ordre d’affichage formulaire).
 */
export async function getBeneficiaryDemandTypeFilterOptions(): Promise<
  BeneficiaryDemandTypeFilterOption[]
> {
  await requireAdministrationDashboard()

  const rows = await prisma.beneficiaryDemandType.findMany({
    select: { id: true, label: true },
    orderBy: [{ sortOrder: "asc" }, { label: "asc" }],
  })

  return rows.map((r) => beneficiaryDemandTypeFilterOptionSchema.parse(r))
}
