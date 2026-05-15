import { z } from "zod"

import {
  adhesionPayloadWithYearSchema,
  MANUAL_ADHESION_PAYMENT_METHOD_LABELS,
  manualAdhesionPayloadSchema,
  memberSchema,
  type ManualAdhesionPayload,
} from "@/app/(public)/adhesion/_schemas/adhesion.schema"

/** Modes de règlement proposés dans l’assistant bureau (UI). */
export const BUREAU_ADHESION_PAYMENT_METHODS = {
  espece: "espece",
  virement: "virement",
  carte: "carte",
} as const

export type BureauAdhesionPaymentMethod =
  (typeof BUREAU_ADHESION_PAYMENT_METHODS)[keyof typeof BUREAU_ADHESION_PAYMENT_METHODS]

export const BUREAU_ADHESION_PAYMENT_METHOD_LABELS: Record<
  BureauAdhesionPaymentMethod,
  string
> = {
  ...MANUAL_ADHESION_PAYMENT_METHOD_LABELS,
  carte: "Carte bancaire",
}

export const bureauAdhesionManualPayloadSchema = manualAdhesionPayloadSchema

export type BureauAdhesionManualPayload = ManualAdhesionPayload

export const bureauAdhesionCardPayloadSchema = adhesionPayloadWithYearSchema

export type BureauAdhesionCardPayload = z.infer<typeof adhesionPayloadWithYearSchema>

export { memberSchema }
