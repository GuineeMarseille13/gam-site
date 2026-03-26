import { prisma } from "@/lib/prisma"
import { requireAdministrationDashboard } from "@/lib/auth-guard"
import {
  beneficiaryDemandTypeRowSchema,
  type BeneficiaryDemandTypeRow,
} from "../_schemas/beneficiary-demand-type.schema"

/**
 * Liste complète des types de demande + nombre de fiches liées (pour la gestion).
 */
export async function getBeneficiaryDemandTypesAdmin(): Promise<BeneficiaryDemandTypeRow[]> {
  await requireAdministrationDashboard()

  const types = await prisma.beneficiaryDemandType.findMany({
    orderBy: [{ sortOrder: "asc" }, { label: "asc" }],
    include: {
      _count: { select: { beneficiaries: true } },
    },
  })

  return types.map((t) =>
    beneficiaryDemandTypeRowSchema.parse({
      id: t.id,
      label: t.label,
      sortOrder: t.sortOrder,
      requiresDetail: t.requiresDetail,
      isActive: t.isActive,
      usageCount: t._count.beneficiaries,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    }),
  )
}
