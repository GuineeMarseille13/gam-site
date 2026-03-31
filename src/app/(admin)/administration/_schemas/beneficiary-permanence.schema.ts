import { z } from "zod"

import { PAYMENT_RESPONSIBLE_VALUES, REQUEST_STATUS_VALUES } from "./beneficiary-suivi-config"

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

export type DocumentTypeOptionForValidation = {
  readonly code: string
  readonly requiresOtherDetail: boolean
}

function uniqueStrings(ids: string[]): string[] {
  return [...new Set(ids)]
}

function documentKeySchemaForCodes(codes: readonly string[]) {
  if (codes.length === 0) {
    return z.never()
  }
  return z.enum([codes[0]!, ...codes.slice(1)] as [string, ...string[]])
}

/**
 * Étape 3 — dossier : documents, statut, commentaire, responsable, paiement (codes documents dynamiques).
 */
export function buildBeneficiaryPermanenceStep3Schema(
  documentTypes: readonly DocumentTypeOptionForValidation[],
) {
  const codes = documentTypes.map((d) => d.code)
  const detailCodes = new Set(
    documentTypes.filter((d) => d.requiresOtherDetail).map((d) => d.code),
  )
  const docKeySchema = documentKeySchemaForCodes(codes)

  return z
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
      const needsDocDetail = data.documentKeys.some((k) => detailCodes.has(k))
      if (needsDocDetail) {
        const t = data.documentOtherDetail?.trim()
        if (!t || t.length < 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Précisez le document (champ obligatoire).",
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
}

export type BeneficiaryPermanenceStep3Input = z.infer<
  ReturnType<typeof buildBeneficiaryPermanenceStep3Schema>
>

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
 * Vérifie que la date de permanence figure dans le calendrier administratif (base).
 */
export function refinePermanenceDateAllowed(
  permanenceDate: string,
  allowedPermanenceDates: ReadonlySet<string>,
  ctx: z.RefinementCtx,
): void {
  if (allowedPermanenceDates.size === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message:
        "Aucune permanence planifiée. Ajoutez des dates dans Administration → Calendrier permanence.",
      path: ["permanenceDate"],
    })
    return
  }
  if (!allowedPermanenceDates.has(permanenceDate)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message:
        "Cette date ne correspond pas à une permanence prévue. Sélectionnez une date disponible dans le calendrier.",
      path: ["permanenceDate"],
    })
  }
}

/**
 * Schéma d’envoi complet — Demande bénéficiaire (permanence administrative).
 */
export function buildSubmitBeneficiaryPermanenceSchema(
  demandTypes: readonly DemandTypeOptionForValidation[],
  documentTypes: readonly DocumentTypeOptionForValidation[],
  allowedPermanenceDates: ReadonlySet<string>,
) {
  const validIds = new Set(demandTypes.map((d) => d.id))
  const detailRequired = new Set(
    demandTypes.filter((d) => d.requiresDetail).map((d) => d.id),
  )

  return buildBeneficiaryPermanenceStep3Schema(documentTypes)
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
    .superRefine((data, ctx) => {
      refinePermanenceDateAllowed(data.permanenceDate, allowedPermanenceDates, ctx)
    })
}

export type SubmitBeneficiaryPermanenceInput = z.infer<
  ReturnType<typeof buildSubmitBeneficiaryPermanenceSchema>
>

/**
 * Étape 1 — date limitée aux journées définies dans le calendrier des permanences.
 */
export function buildBeneficiaryPermanenceStep1Schema(
  allowedPermanenceDates: ReadonlySet<string>,
) {
  return z
    .object({
      permanenceDate: dateYmd,
    })
    .strict()
    .superRefine((data, ctx) => {
      refinePermanenceDateAllowed(data.permanenceDate, allowedPermanenceDates, ctx)
    })
}

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
