import { formatPaymentMethodLabel } from "@/config/bureau-payment-methods"
import { escapeHtml } from "@/helpers/email/_templates/escape-html"

/** Palette noir moderne — e-mail de confirmation commande uniquement. */
export const EMAIL_ORDER_MODERN_PALETTE = {
  accentColor: "#0f172a",
  pageBackground: "#f4f4f5",
  outerBorder: "#e4e4e7",
  outerShadow: "0 4px 24px rgba(15,23,42,0.08)",
  textStrong: "#0f172a",
  textMuted: "#475569",
  textSubtle: "#64748b",
  brandStrong: "#18181b",
  cardBackground: "linear-gradient(180deg, #fafafa 0%, #ffffff 100%)",
  cardBorder: "#e4e4e7",
  labelAccent: "#52525b",
  tableBorder: "#e4e4e7",
  tableRowBorder: "#f4f4f5",
  tableHeaderGradient: "linear-gradient(90deg, #18181b 0%, #27272a 100%)",
  chipBackground: "#fafafa",
  chipBorder: "#e4e4e7",
  chipText: "#18181b",
  footerBackground: "#fafafa",
} as const

/** Enveloppe layout modern — commande (noir). */
export const EMAIL_ORDER_MODERN_SHELL = {
  pageBackground: EMAIL_ORDER_MODERN_PALETTE.pageBackground,
  outerBorder: `border:1px solid ${EMAIL_ORDER_MODERN_PALETTE.outerBorder};box-shadow:${EMAIL_ORDER_MODERN_PALETTE.outerShadow};`,
  footerBackground: EMAIL_ORDER_MODERN_PALETTE.footerBackground,
} as const

/** Enveloppe layout modern — adhésion / don (bleu). */
export const EMAIL_BLUE_MODERN_SHELL = {
  pageBackground: "#eef2ff",
  outerBorder: "border:1px solid #dbeafe;box-shadow:0 4px 24px rgba(37,99,235,0.08);",
  footerBackground: "#f8fafc",
} as const

/**
 * Pastille mode de paiement — style noir moderne (commande).
 */
export function buildOrderPaymentChip(paymentMethodLabel: string): string {
  const label = escapeHtml(formatPaymentMethodLabel(paymentMethodLabel))
  const palette = EMAIL_ORDER_MODERN_PALETTE

  return `
    <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 24px;">
      <tr>
        <td style="padding:8px 14px;background:${palette.chipBackground};border:1px solid ${palette.chipBorder};border-radius:999px;font-size:13px;color:${palette.chipText};">
          <span style="color:${palette.textSubtle};">Paiement ·</span> <strong>${label}</strong>
        </td>
      </tr>
    </table>`
}
