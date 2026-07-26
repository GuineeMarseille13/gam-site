import { z } from "zod"

import {
  PAYMENT_RESPONSIBLE_LABELS,
  REQUEST_STATUS_LABELS,
  REQUEST_STATUS_VALUES,
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

/**
 * Query string page Suivi demande (?type=id). Valeur normalisée (trim, premier élément si tableau).
 */
export const suiviDemandeSearchParamsSchema = z
  .object({
    type: z.preprocess((val: unknown) => {
      if (val === undefined || val === null) return undefined
      const raw = Array.isArray(val) ? val[0] : val
      if (typeof raw !== "string") return undefined
      const t = raw.trim()
      return t === "" ? undefined : t
    }, z.string().optional()),
  })
  .strict()

export type SuiviDemandeSearchParams = z.infer<typeof suiviDemandeSearchParamsSchema>

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
 * Groupe liste « Suivi demande » — une ligne par bénéficiaire (plusieurs fiches possibles).
 */
export const beneficiaryTrackingListGroupSchema = z
  .object({
    identityKey: z.string().min(1),
    latestFicheId: z.string().min(1),
    firstName: z.string(),
    lastName: z.string(),
    ficheCount: z.number().int().positive(),
    latestPermanenceDate: z.string(),
    demandTypeLabels: z.array(z.string()),
    latestRequestStatus: z.string().nullable(),
    latestRequestStatusLabel: z.string().nullable(),
    latestAssignedResponsibleName: z.string().nullable(),
  })
  .strict()

export type BeneficiaryTrackingListGroup = z.infer<typeof beneficiaryTrackingListGroupSchema>

/**
 * Fiche liée (même identité soft) sur la page détail.
 */
export const beneficiaryTrackingRelatedFicheSchema = z
  .object({
    id: z.string().min(1),
    permanenceDate: z.string(),
    demandTypeLabels: z.array(z.string()),
    requestStatus: z.string().nullable(),
    requestStatusLabel: z.string().nullable(),
    assignedResponsibleName: z.string().nullable(),
    createdAt: z.string(),
  })
  .strict()

export type BeneficiaryTrackingRelatedFiche = z.infer<
  typeof beneficiaryTrackingRelatedFicheSchema
>

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
    documentKeys: z.array(z.string()),
    documentLabelLines: z.array(z.string()),
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
