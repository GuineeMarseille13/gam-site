import { prisma } from "@/lib/prisma"
import { requireAdministrationDashboard } from "@/lib/auth-guard"
import {
  beneficiaryTrackingDetailSchema,
  type BeneficiaryTrackingDetail,
} from "../_schemas/beneficiary-tracking.schema"
import {
  BENEFICIARY_DOCUMENT_KEYS,
  REQUEST_STATUS_VALUES,
  type BeneficiaryDocumentKey,
} from "../_schemas/beneficiary-suivi-config"

function parseDocumentKeys(json: unknown): BeneficiaryDocumentKey[] {
  const parsed = Array.isArray(json) ? json : []
  const out: BeneficiaryDocumentKey[] = []
  for (const item of parsed) {
    if (typeof item !== "string") continue
    if (BENEFICIARY_DOCUMENT_KEYS.includes(item as BeneficiaryDocumentKey)) {
      out.push(item as BeneficiaryDocumentKey)
    }
  }
  return out
}

function normalizeRequestStatus(value: string | null): BeneficiaryTrackingDetail["requestStatus"] {
  if (!value) return null
  if (REQUEST_STATUS_VALUES.includes(value as (typeof REQUEST_STATUS_VALUES)[number])) {
    return value as BeneficiaryTrackingDetail["requestStatus"]
  }
  return null
}

/**
 * Détail d’une fiche pour Suivi demande (administration).
 */
export async function getBeneficiaryDetailForTracking(
  id: string,
): Promise<BeneficiaryTrackingDetail | null> {
  await requireAdministrationDashboard()

  const r = await prisma.beneficiary.findUnique({
    where: { id },
    include: {
      demandTypes: {
        select: { label: true },
        orderBy: [{ sortOrder: "asc" }, { label: "asc" }],
      },
    },
  })

  if (!r) return null

  const documentKeys = parseDocumentKeys(r.documentsProvided)

  return beneficiaryTrackingDetailSchema.parse({
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
    birthCountry: r.birthCountry,
    birthMunicipality: r.birthMunicipality,
    fatherName: r.fatherName,
    motherName: r.motherName,
    gmailAccount: r.gmailAccount,
    hasGmailPassword: Boolean(r.gmailPassword && r.gmailPassword.length > 0),
    ekadiLogin: r.ekadiLogin,
    hasEkadiPassword: Boolean(r.ekadiPassword && r.ekadiPassword.length > 0),
    documentKeys,
    documentOtherDetail: r.documentOtherDetail,
    requestStatus: normalizeRequestStatus(r.requestStatus),
    statusComment: r.statusComment,
    assignedResponsibleName: r.assignedResponsibleName,
    paymentResponsible: r.paymentResponsible,
    paymentOtherDetail: r.paymentOtherDetail,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  })
}
