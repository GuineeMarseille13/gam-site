import { prisma } from "@/lib/prisma"
import { requireAdministrationDashboard } from "@/lib/auth-guard"
import {
  beneficiaryTrackingDetailSchema,
  type BeneficiaryTrackingDetail,
} from "../_schemas/beneficiary-tracking.schema"
import { REQUEST_STATUS_VALUES } from "../_schemas/beneficiary-suivi-config"

function parseDocumentKeys(json: unknown): string[] {
  if (!Array.isArray(json)) {
    return []
  }
  return json.filter((x): x is string => typeof x === "string")
}

function normalizeRequestStatus(value: string | null): BeneficiaryTrackingDetail["requestStatus"] {
  if (!value) return null
  if (REQUEST_STATUS_VALUES.includes(value as (typeof REQUEST_STATUS_VALUES)[number])) {
    return value as BeneficiaryTrackingDetail["requestStatus"]
  }
  return null
}

function buildDocumentLabelLines(params: {
  readonly documentKeys: string[]
  readonly documentOtherDetail: string | null
  readonly typeByCode: ReadonlyMap<
    string,
    { readonly label: string; readonly requiresOtherDetail: boolean }
  >
}): string[] {
  const detail = params.documentOtherDetail?.trim()
  return params.documentKeys.map((code) => {
    const t = params.typeByCode.get(code)
    if (t?.requiresOtherDetail && detail) {
      return `${t.label} (${detail})`
    }
    return t?.label ?? code
  })
}

/**
 * Détail d’une fiche pour Suivi demande (administration).
 */
export async function getBeneficiaryDetailForTracking(
  id: string,
): Promise<BeneficiaryTrackingDetail | null> {
  await requireAdministrationDashboard()

  const docTypes = await prisma.beneficiaryDocumentType.findMany({
    select: { code: true, label: true, requiresOtherDetail: true },
  })
  const typeByCode = new Map(
    docTypes.map((t) => [
      t.code,
      { label: t.label, requiresOtherDetail: t.requiresOtherDetail },
    ]),
  )

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
  const documentLabelLines = buildDocumentLabelLines({
    documentKeys,
    documentOtherDetail: r.documentOtherDetail,
    typeByCode,
  })

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
    documentLabelLines,
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
