import { INVOICE_LEGAL_NAME } from "@/config/invoice"

/** Nom affiché dans l’expéditeur des e-mails transactionnels. */
export const EMAIL_SENDER_NAME = INVOICE_LEGAL_NAME

/** Sujets des confirmations post-paiement (adhésion, don, commande). */
export const EMAIL_SUBJECTS = {
  adhesionConfirmation: "Confirmation de votre adhésion",
  donationConfirmation: "Merci pour votre don",
  orderConfirmation: "Confirmation de votre commande",
} as const

/** Thèmes visuels par type de transaction. */
export const EMAIL_TRANSACTION_THEMES = {
  adhesion: {
    accentColor: "#2563eb",
    accentSoft: "#eff6ff",
    badgeLabel: "Adhésion confirmée",
    modernGradientMid: "#1d4ed8",
    modernGradientEnd: "#1e3a8a",
  },
  donation: {
    accentColor: "#059669",
    accentSoft: "#ecfdf5",
    badgeLabel: "Don enregistré",
    modernGradientMid: "#047857",
    modernGradientEnd: "#065f46",
  },
  order: {
    accentColor: "#0f172a",
    accentSoft: "#fafafa",
    badgeLabel: "Commande confirmée",
    modernGradientMid: "#27272a",
    modernGradientEnd: "#09090b",
  },
} as const

/** Mention facture — version texte brut (e-mails multipart text). */
export const EMAIL_INVOICE_NOTICE_TEXT =
  "Si vous avez besoin d'une facture, merci de bien vouloir contacter l'association."
