import { z } from "zod"

import {
  BENEFICIARY_DOCUMENT_KEYS,
  BENEFICIARY_DOCUMENT_LABELS,
  PAYMENT_RESPONSIBLE_LABELS,
  REQUEST_STATUS_LABELS,
  REQUEST_STATUS_VALUES,
  type BeneficiaryDocumentKey,
  type PaymentResponsibleValue,
  type RequestStatusValue,
} from "./beneficiary-suivi-config"

const cuidLike = z.string().min(1, "Identifiant invalide.")

export const beneficiaryTrackingParamsSchema = z
  .object({
    id: cuidLike,
  })
  .strict()

export type BeneficiaryTrackingParams = z.infer<typeof beneficiaryTrackingParamsSchema>

const documentKeyEnum = z.enum(
  BENEFICIARY_DOCUMENT_KEYS as unknown as [string, ...string[]],
)

/**
 * Mise à jour du statut de demande (suivi).
 */
export const updateBeneficiaryRequestStatusSchema = z
  .object({
    id: cuidLike,
    requestStatus: z.enum(
      REQUEST_STATUS_VALUES as unknown as [RequestStatusValue, ...RequestStatusValue[]],
    ),
    statusComment: z
      .string()
      .max(4000)
      .optional()
      .transform((s) => {
        const t = s?.trim()
        return t === "" || t === undefined ? undefined : t
      }),
  })
  .strict()

export type UpdateBeneficiaryRequestStatusInput = z.infer<typeof updateBeneficiaryRequestStatusSchema>

/**
 * Ligne liste « Suivi demande ».
 */
export const beneficiaryTrackingListRowSchema = z
  .object({
    id: z.string(),
    permanenceDate: z.string(),
    demandTypeLabels: z.array(z.string()),
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string().nullable(),
    requestStatus: z.string().nullable(),
    requestStatusLabel: z.string().nullable(),
    assignedResponsibleName: z.string().nullable(),
    createdAt: z.string(),
  })
  .strict()

export type BeneficiaryTrackingListRow = z.infer<typeof beneficiaryTrackingListRowSchema>

/**
 * Détail complet pour la page de suivi (données internes administration).
 */
export const beneficiaryTrackingDetailSchema = z
  .object({
    id: z.string(),
    permanenceDate: z.string(),
    demandTypeLabels: z.array(z.string()),
    requestDetail: z.string().nullable(),
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string().nullable(),
    email: z.string().nullable(),
    notes: z.string().nullable(),
    birthDate: z.string().nullable(),
    birthCountry: z.string().nullable(),
    birthMunicipality: z.string().nullable(),
    fatherName: z.string().nullable(),
    motherName: z.string().nullable(),
    gmailAccount: z.string().nullable(),
    hasGmailPassword: z.boolean(),
    ekadiLogin: z.string().nullable(),
    hasEkadiPassword: z.boolean(),
    documentKeys: z.array(documentKeyEnum),
    documentOtherDetail: z.string().nullable(),
    requestStatus: z
      .enum(REQUEST_STATUS_VALUES as unknown as [RequestStatusValue, ...RequestStatusValue[]])
      .nullable(),
    statusComment: z.string().nullable(),
    assignedResponsibleName: z.string().nullable(),
    paymentResponsible: z.string().nullable(),
    paymentOtherDetail: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .strict()

export type BeneficiaryTrackingDetail = z.infer<typeof beneficiaryTrackingDetailSchema>

export function formatDocumentLabelsForDetail(
  keys: readonly BeneficiaryDocumentKey[],
  documentOtherDetail: string | null,
): string[] {
  return keys.map((k) => {
    if (k === "OTHER" && documentOtherDetail?.trim()) {
      return `Autre (${documentOtherDetail.trim()})`
    }
    return BENEFICIARY_DOCUMENT_LABELS[k]
  })
}

export function paymentLabel(value: string | null): string {
  if (!value) return "—"
  if (value in PAYMENT_RESPONSIBLE_LABELS) {
    return PAYMENT_RESPONSIBLE_LABELS[value as PaymentResponsibleValue]
  }
  return value
}

export function requestStatusLabel(value: string | null): string {
  if (!value) return "—"
  if (value in REQUEST_STATUS_LABELS) {
    return REQUEST_STATUS_LABELS[value as RequestStatusValue]
  }
  return value
}
