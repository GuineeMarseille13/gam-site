/**
 * Valeurs stockées en base pour la Demande bénéficiaire (cohérentes avec l’ancien Google Form).
 * Les clés « documents fournis » sont définies en base (`BeneficiaryDocumentType`), pas ici.
 */

export const REQUEST_STATUS_VALUES = ["PENDING_DOCUMENTS", "COMPLETED"] as const
export type RequestStatusValue = (typeof REQUEST_STATUS_VALUES)[number]

export const REQUEST_STATUS_LABELS: Record<RequestStatusValue, string> = {
  PENDING_DOCUMENTS: "En attente de document",
  COMPLETED: "Terminé",
}

export const PAYMENT_RESPONSIBLE_VALUES = [
  "GAM",
  "BENEFICIARY",
  "VOLUNTEER",
  "NONE",
  "OTHER",
] as const
export type PaymentResponsibleValue = (typeof PAYMENT_RESPONSIBLE_VALUES)[number]

export const PAYMENT_RESPONSIBLE_LABELS: Record<PaymentResponsibleValue, string> = {
  GAM: "GAM",
  BENEFICIARY: "Le bénéficiaire",
  VOLUNTEER: "Le bénévole",
  NONE: "Pas de paiement",
  OTHER: "Autre",
}
