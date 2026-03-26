import { prisma } from "@/lib/prisma"
import { requireAdministrationDashboard } from "@/lib/auth-guard"
import {
  beneficiaryPermanenceRowSchema,
  type BeneficiaryPermanenceRow,
} from "../_schemas/beneficiary-permanence.schema"
import { REQUEST_STATUS_LABELS, type RequestStatusValue } from "../_schemas/beneficiary-suivi-config"

const TAKE = 25

function statusLabel(value: string | null): string | null {
  if (!value) return null
  if (value in REQUEST_STATUS_LABELS) {
    return REQUEST_STATUS_LABELS[value as RequestStatusValue]
  }
  return value
}

/**
 * Dernières fiches suivi permanence (demandeurs) enregistrées sur le dashboard.
 */
export async function getRecentBeneficiaries(): Promise<BeneficiaryPermanenceRow[]> {
  await requireAdministrationDashboard()

  const rows = await prisma.beneficiary.findMany({
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
    beneficiaryPermanenceRowSchema.parse({
      id: r.id,
      permanenceDate: r.permanenceDate.toISOString().slice(0, 10),
      demandTypeLabels: r.demandTypes.map((d) => d.label),
      requestDetail: r.requestDetail,
      firstName: r.firstName,
      lastName: r.lastName,
      phone: r.phone,
      email: r.email,
      notes: r.notes,
      birthDate: r.birthDate ? r.birthDate.toISOString().slice(0, 10) : null,
      requestStatusLabel: statusLabel(r.requestStatus),
      assignedResponsibleName: r.assignedResponsibleName,
      createdAt: r.createdAt.toISOString(),
    }),
  )
}
