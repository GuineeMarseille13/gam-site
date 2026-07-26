import { prisma } from "@/lib/prisma"
import { requireAdministrationDashboard } from "@/lib/auth-guard"
import { buildBeneficiaryIdentityKey } from "../_lib/beneficiary-identity-key"
import {
  beneficiaryTrackingRelatedFicheSchema,
  type BeneficiaryTrackingRelatedFiche,
} from "../_schemas/beneficiary-tracking.schema"
import { REQUEST_STATUS_LABELS, type RequestStatusValue } from "../_schemas/beneficiary-suivi-config"

const RELATED_TAKE = 80

function statusLabel(value: string | null): string | null {
  if (!value) return null
  if (value in REQUEST_STATUS_LABELS) {
    return REQUEST_STATUS_LABELS[value as RequestStatusValue]
  }
  return value
}

function toYmd(value: Date): string {
  return value.toISOString().slice(0, 10)
}

/**
 * Fiches du même bénéficiaire (identité soft) pour la page détail — plus récentes en premier.
 */
export async function getRelatedBeneficiaryFichesForTracking(
  ficheId: string,
): Promise<BeneficiaryTrackingRelatedFiche[]> {
  await requireAdministrationDashboard()

  const current = await prisma.beneficiary.findUnique({
    where: { id: ficheId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      birthDate: true,
      phone: true,
    },
  })

  if (!current) return []

  const currentKey = buildBeneficiaryIdentityKey({
    firstName: current.firstName,
    lastName: current.lastName,
    birthDate: current.birthDate ? toYmd(current.birthDate) : null,
    phone: current.phone,
  })

  const candidates = await prisma.beneficiary.findMany({
    where: {
      firstName: { equals: current.firstName, mode: "insensitive" },
      lastName: { equals: current.lastName, mode: "insensitive" },
    },
    orderBy: { createdAt: "desc" },
    take: RELATED_TAKE,
    include: {
      demandTypes: {
        select: { label: true },
        orderBy: [{ sortOrder: "asc" }, { label: "asc" }],
      },
    },
  })

  return candidates
    .filter((row) => {
      const key = buildBeneficiaryIdentityKey({
        firstName: row.firstName,
        lastName: row.lastName,
        birthDate: row.birthDate ? toYmd(row.birthDate) : null,
        phone: row.phone,
      })
      return key === currentKey
    })
    .map((row) =>
      beneficiaryTrackingRelatedFicheSchema.parse({
        id: row.id,
        permanenceDate: row.permanenceDate.toISOString().slice(0, 10),
        demandTypeLabels: row.demandTypes.map((d) => d.label),
        requestStatus: row.requestStatus,
        requestStatusLabel: statusLabel(row.requestStatus),
        assignedResponsibleName: row.assignedResponsibleName,
        createdAt: row.createdAt.toISOString(),
      }),
    )
}
