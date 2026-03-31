import { prisma } from "@/lib/prisma"
import { requireAdministrationDashboard } from "@/lib/auth-guard"
import {
  beneficiaryTrackingListRowSchema,
  type BeneficiaryTrackingListRow,
} from "../_schemas/beneficiary-tracking.schema"
import { REQUEST_STATUS_LABELS, type RequestStatusValue } from "../_schemas/beneficiary-suivi-config"

const TAKE = 500

export interface GetBeneficiariesForTrackingOptions {
  /** Limite aux dossiers qui incluent ce type de demande (relation Prisma). */
  demandTypeId?: string
}

function statusLabel(value: string | null): string | null {
  if (!value) return null
  if (value in REQUEST_STATUS_LABELS) {
    return REQUEST_STATUS_LABELS[value as RequestStatusValue]
  }
  return value
}

/**
 * Liste des fiches pour la page Suivi demande (tri récent en premier).
 */
export async function getBeneficiariesForTracking(
  options: GetBeneficiariesForTrackingOptions = {},
): Promise<BeneficiaryTrackingListRow[]> {
  await requireAdministrationDashboard()

  const { demandTypeId } = options

  const rows = await prisma.beneficiary.findMany({
    where: demandTypeId
      ? {
          demandTypes: { some: { id: demandTypeId } },
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    take: TAKE,
    include: {
      demandTypes: {
        select: { label: true },
        orderBy: [{ sortOrder: "asc" }, { label: "asc" }],
      },
    },
  })

  return rows.map((r) =>
    beneficiaryTrackingListRowSchema.parse({
      id: r.id,
      permanenceDate: r.permanenceDate.toISOString().slice(0, 10),
      demandTypeLabels: r.demandTypes.map((d) => d.label),
      firstName: r.firstName,
      lastName: r.lastName,
      phone: r.phone,
      requestStatus: r.requestStatus,
      requestStatusLabel: statusLabel(r.requestStatus),
      assignedResponsibleName: r.assignedResponsibleName,
      createdAt: r.createdAt.toISOString(),
    }),
  )
}
