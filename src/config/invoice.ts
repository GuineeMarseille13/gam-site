/**
 * Textes légaux et identité émetteur (en-tête facture / reçu).
 * L’adresse affichée est complétée par `Contact` en base lorsque disponible.
 */
export const INVOICE_LEGAL_NAME = "Guinée À Marseille (GAM)"
export const INVOICE_TAGLINE = "Association loi 1901"

/** Mentions sous le total (TVA asso / reçu). */
export const INVOICE_LEGAL_FOOTER_LINES = [
  "TVA non applicable — association sans activité économique relevant du régime des frais de fonctionnement.",
  "Ce document tient lieu de reçu et atteste du règlement indiqué, sous réserve de son bon encaissement.",
] as const
