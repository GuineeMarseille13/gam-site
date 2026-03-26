import { z } from "zod"

import {
  BENEFICIARY_DOCUMENT_KEYS,
  PAYMENT_RESPONSIBLE_VALUES,
  REQUEST_STATUS_VALUES,
} from "./beneficiary-suivi-config"

const dateYmd = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide.")
  .refine((s) => !Number.isNaN(Date.parse(s)), { message: "Date invalide." })

const optionalTrimmed = z
  .string()
  .optional()
  .transform((s) => {
    const t = s?.trim()
    return t === "" || t === undefined ? undefined : t
  })

const optionalEmail = optionalTrimmed.pipe(
  z.union([z.undefined(), z.string().email("Email invalide.")]).optional(),
)

const requiredPhone = z
  .string()
  .min(1, "Numéro de téléphone requis.")
  .transform((s) => s.trim())
  .pipe(
    z
      .string()
      .min(8, "Numéro trop court.")
      .max(32)
      .regex(/^[\d\s+()./-]+$/, "Caractères invalides pour un téléphone."),
  )

const docKeySchema = z.enum(
  BENEFICIARY_DOCUMENT_KEYS as unknown as [string, ...string[]],
)

const paymentEnum = z.enum(
  PAYMENT_RESPONSIBLE_VALUES as unknown as [string, ...string[]],
)

const requestStatusEnum = z.enum(
  REQUEST_STATUS_VALUES as unknown as [string, ...string[]],
)

export type DemandTypeOptionForValidation = {
  readonly id: string
  readonly requiresDetail: boolean
}

function uniqueStrings(ids: string[]): string[] {
  return [...new Set(ids)]
}

/**
 * Étape 3 — dossier : documents, statut, commentaire, responsable, paiement.
 */
export const beneficiaryPermanenceStep3Schema = z
  .object({
    documentKeys: z.array(docKeySchema),
    documentOtherDetail: optionalTrimmed.pipe(
      z.union([z.undefined(), z.string().min(1).max(500)]).optional(),
    ),
    requestStatus: requestStatusEnum,
    statusComment: z
      .string()
      .max(4000)
      .optional()
      .transform((s) => {
        const t = s?.trim()
        return t === "" || t === undefined ? undefined : t
      }),
    assignedResponsibleName: z
      .string()
      .min(2, "Indiquez le responsable en charge.")
      .max(120)
      .transform((s) => s.trim()),
    paymentResponsible: paymentEnum,
    paymentOtherDetail: optionalTrimmed.pipe(
      z.union([z.undefined(), z.string().min(1).max(200)]).optional(),
    ),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.documentKeys.includes("OTHER")) {
      const t = data.documentOtherDetail?.trim()
      if (!t || t.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Précisez le document « Autre ».",
          path: ["documentOtherDetail"],
        })
      }
    }
    if (data.paymentResponsible === "OTHER") {
      const t = data.paymentOtherDetail?.trim()
      if (!t || t.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Précisez le paiement (autre).",
          path: ["paymentOtherDetail"],
        })
      }
    }
  })

export type BeneficiaryPermanenceStep3Input = z.infer<typeof beneficiaryPermanenceStep3Schema>

/**
 * Étape 4 — identité, naissance, contact, comptes (données sensibles côté serveur uniquement).
 */
export const beneficiaryPermanenceStep4Schema = z
  .object({
    firstName: z
      .string()
      .min(1, "Indiquez le prénom.")
      .max(80)
      .transform((s) => s.trim()),
    lastName: z
      .string()
      .min(1, "Indiquez le nom.")
      .max(80)
      .transform((s) => s.trim()),
    birthDate: dateYmd,
    birthCountry: z
      .string()
      .max(80)
      .optional()
      .transform((s) => {
        const t = s?.trim()
        return t === "" || t === undefined ? undefined : t
      }),
    birthMunicipality: z
      .string()
      .min(2, "Indiquez la commune de naissance.")
      .max(120)
      .transform((s) => s.trim()),
    fatherName: z
      .string()
      .max(120)
      .optional()
      .transform((s) => {
        const t = s?.trim()
        return t === "" || t === undefined ? undefined : t
      }),
    motherName: z
      .string()
      .max(120)
      .optional()
      .transform((s) => {
        const t = s?.trim()
        return t === "" || t === undefined ? undefined : t
      }),
    phone: requiredPhone,
    email: optionalEmail,
    gmailAccount: z
      .string()
      .optional()
      .transform((s) => {
        const t = s?.trim()
        return t === "" || t === undefined ? undefined : t
      })
      .pipe(z.union([z.undefined(), z.string().email("Compte Gmail invalide.")])),
    gmailPassword: z
      .string()
      .max(500)
      .optional()
      .transform((s) => {
        const t = s?.trim()
        return t === "" || t === undefined ? undefined : t
      }),
    ekadiLogin: z
      .string()
      .max(200)
      .optional()
      .transform((s) => {
        const t = s?.trim()
        return t === "" || t === undefined ? undefined : t
      }),
    ekadiPassword: z
      .string()
      .max(500)
      .optional()
      .transform((s) => {
        const t = s?.trim()
        return t === "" || t === undefined ? undefined : t
      }),
  })
  .strict()

export type BeneficiaryPermanenceStep4Input = z.infer<typeof beneficiaryPermanenceStep4Schema>

/**
 * Schéma d’envoi complet — suivi permanence.
 */
export function buildSubmitBeneficiaryPermanenceSchema(
  demandTypes: readonly DemandTypeOptionForValidation[],
) {
  const validIds = new Set(demandTypes.map((d) => d.id))
  const detailRequired = new Set(
    demandTypes.filter((d) => d.requiresDetail).map((d) => d.id),
  )

  return beneficiaryPermanenceStep3Schema
    .merge(beneficiaryPermanenceStep4Schema)
    .extend({
      permanenceDate: dateYmd,
      requestTypeIds: z
        .array(z.string().min(1))
        .min(1, "Sélectionnez au moins un type de demande.")
        .transform(uniqueStrings),
      requestDetail: optionalTrimmed.pipe(
        z.union([z.string().min(2).max(500), z.undefined()]),
      ),
      notes: z
        .string()
        .max(4000)
        .optional()
        .transform((s) => {
          const t = s?.trim()
          return t === "" || t === undefined ? undefined : t
        }),
    })
    .strict()
    .superRefine((data, ctx) => {
      for (const id of data.requestTypeIds) {
        if (!validIds.has(id)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Type de demande invalide ou inactif.",
            path: ["requestTypeIds"],
          })
          return
        }
      }
      const needsDetail = data.requestTypeIds.some((id) => detailRequired.has(id))
      if (needsDetail) {
        const t = data.requestDetail?.trim()
        if (!t || t.length < 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Précisez la demande.",
            path: ["requestDetail"],
          })
        }
      }
    })
}

export type SubmitBeneficiaryPermanenceInput = z.infer<
  ReturnType<typeof buildSubmitBeneficiaryPermanenceSchema>
>

export const beneficiaryPermanenceStep1Schema = z
  .object({
    permanenceDate: dateYmd,
  })
  .strict()

export function buildBeneficiaryPermanenceStep2Schema(
  demandTypes: readonly DemandTypeOptionForValidation[],
) {
  const validIds = new Set(demandTypes.map((d) => d.id))
  const detailRequired = new Set(
    demandTypes.filter((d) => d.requiresDetail).map((d) => d.id),
  )

  return z
    .object({
      requestTypeIds: z
        .array(z.string().min(1))
        .min(1, "Sélectionnez au moins un type de demande.")
        .transform(uniqueStrings),
      requestDetail: z.string().optional(),
    })
    .strict()
    .superRefine((data, ctx) => {
      for (const id of data.requestTypeIds) {
        if (!validIds.has(id)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Type invalide.",
            path: ["requestTypeIds"],
          })
          return
        }
      }
      const needsDetail = data.requestTypeIds.some((id) => detailRequired.has(id))
      if (needsDetail) {
        const t = data.requestDetail?.trim()
        if (!t || t.length < 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Précisez la demande.",
            path: ["requestDetail"],
          })
        }
      }
    })
}

export const beneficiaryPermanenceRowSchema = z
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
    requestStatusLabel: z.string().nullable(),
    assignedResponsibleName: z.string().nullable(),
    createdAt: z.string(),
  })
  .strict()

export type BeneficiaryPermanenceRow = z.infer<typeof beneficiaryPermanenceRowSchema>
