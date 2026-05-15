import { z } from "zod"

/** Modes de règlement manuels (espèces, virement). */
export const manualPaymentMethodSchema = z.enum(["espece", "virement"])

export type ManualPaymentMethod = z.infer<typeof manualPaymentMethodSchema>

export const MANUAL_PAYMENT_METHOD_LABELS: Record<ManualPaymentMethod, string> = {
  espece: "Espèces",
  virement: "Virement",
}

/** Modes proposés dans les assistants bureau (UI). */
export const BUREAU_PAYMENT_METHODS = {
  espece: "espece",
  virement: "virement",
  carte: "carte",
} as const

export type BureauPaymentMethod =
  (typeof BUREAU_PAYMENT_METHODS)[keyof typeof BUREAU_PAYMENT_METHODS]

export const BUREAU_PAYMENT_METHOD_LABELS: Record<BureauPaymentMethod, string> = {
  ...MANUAL_PAYMENT_METHOD_LABELS,
  carte: "Carte bancaire",
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  card: "Carte bancaire",
  espèces: "Espèces",
  ...BUREAU_PAYMENT_METHOD_LABELS,
}

/**
 * Libellé lisible d’un mode de règlement (Stripe ou saisie manuelle).
 */
export function formatPaymentMethodLabel(paymentMethod?: string | null): string {
  if (!paymentMethod?.trim()) {
    return "—"
  }

  const trimmed = paymentMethod.trim()
  const normalized = trimmed.toLowerCase()
  const mapped = PAYMENT_METHOD_LABELS[normalized]
  if (mapped) {
    return mapped
  }

  if (trimmed === "Espèces" || trimmed === "Virement") {
    return trimmed
  }

  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
}
