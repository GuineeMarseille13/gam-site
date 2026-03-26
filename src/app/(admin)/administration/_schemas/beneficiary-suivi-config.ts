/**
 * Valeurs stockées en base pour la Demande bénéficiaire (cohérentes avec l’ancien Google Form).
 */
export const BENEFICIARY_DOCUMENT_KEYS = [
  "BIRTH_CERT_BIOMETRIC",
  "SUPPLEMENTARY_JUDGMENT",
  "BIRTH_CERTIFICATE",
  "PROOF_OF_ADDRESS",
  "PASSPORT",
  "RESIDENCE_PERMIT",
  "ID_DOCUMENT",
  "CONSULAR_CARD",
  "OTHER",
] as const

export type BeneficiaryDocumentKey = (typeof BENEFICIARY_DOCUMENT_KEYS)[number]

export const BENEFICIARY_DOCUMENT_LABELS: Record<BeneficiaryDocumentKey, string> = {
  BIRTH_CERT_BIOMETRIC: "Acte de naissance biométrique",
  SUPPLEMENTARY_JUDGMENT: "Jugement supplétif",
  BIRTH_CERTIFICATE: "Acte de naissance",
  PROOF_OF_ADDRESS: "Justificatif de domicile",
  PASSPORT: "Passeport",
  RESIDENCE_PERMIT: "Titre de séjour",
  ID_DOCUMENT: "Pièce d'identité",
  CONSULAR_CARD: "Carte consulaire",
  OTHER: "Autre",
}

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
