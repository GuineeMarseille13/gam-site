import { EMAIL_SUBJECTS, EMAIL_TRANSACTION_THEMES } from "@/config/email"
import { formatPaymentMethodLabel } from "@/config/bureau-payment-methods"
import type { DonationConfirmationEmailPayload } from "@/helpers/email/_schemas/transaction-email.schema"
import { escapeHtml } from "@/helpers/email/_templates/escape-html"
import { wrapEmailLayout } from "@/helpers/email/_templates/email-layout"
import { finalizeTransactionEmailText } from "@/helpers/email/_templates/transaction-email-notices"
import { formatCurrency } from "@/helpers/format-currency"

const theme = EMAIL_TRANSACTION_THEMES.donation

function buildPaymentChip(paymentMethodLabel: string): string {
  const label = escapeHtml(formatPaymentMethodLabel(paymentMethodLabel))

  return `
    <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 24px;">
      <tr>
        <td style="padding:8px 14px;background:#ecfdf5;border:1px solid #a7f3d0;border-radius:999px;font-size:13px;color:#047857;">
          <span style="color:#64748b;">Paiement ·</span> <strong>${label}</strong>
        </td>
      </tr>
    </table>`
}

function buildMessageBlock(message: string): string {
  return `
    <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#0f172a;text-transform:uppercase;letter-spacing:0.06em;">Votre message</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 24px;border:1px solid #a7f3d0;border-radius:14px;overflow:hidden;background:#ffffff;">
      <tr>
        <td style="padding:16px 18px;font-size:15px;line-height:1.6;color:#475569;font-style:italic;">
          ${escapeHtml(message)}
        </td>
      </tr>
    </table>`
}

export function buildDonationConfirmationSubject(): string {
  return EMAIL_SUBJECTS.donationConfirmation
}

export function buildDonationConfirmationHtml(
  payload: DonationConfirmationEmailPayload,
): string {
  const firstName = escapeHtml(payload.firstName)
  const amount = formatCurrency(payload.amountEur)
  const paymentChip = payload.paymentMethodLabel
    ? buildPaymentChip(payload.paymentMethodLabel)
    : ""
  const messageBlock = payload.message ? buildMessageBlock(payload.message) : ""

  const bodyHtml = `
    <h1 style="margin:0 0 10px;font-size:24px;font-weight:700;color:#0f172a;letter-spacing:-0.02em;">Merci, ${firstName}</h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#475569;">
      Votre générosité fait avancer les projets de <strong style="color:#065f46;">Guinée À Marseille</strong>.
      Nous avons bien enregistré votre don — merci pour votre soutien !
    </p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 24px;background:linear-gradient(180deg, #ecfdf5 0%, #ffffff 100%);border:1px solid #a7f3d0;border-radius:16px;">
      <tr>
        <td style="padding:22px 24px;">
          <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#10b981;text-transform:uppercase;letter-spacing:0.1em;">Montant du don</p>
          <p style="margin:0;font-size:34px;font-weight:800;color:${theme.accentColor};letter-spacing:-0.03em;line-height:1.1;">${escapeHtml(amount)}</p>
        </td>
      </tr>
    </table>
    ${paymentChip}
    ${messageBlock}`

  return wrapEmailLayout({
    previewText: `Merci pour votre don de ${amount}`,
    title: EMAIL_SUBJECTS.donationConfirmation,
    bodyHtml,
    accentColor: theme.accentColor,
    accentSoft: theme.accentSoft,
    badgeLabel: theme.badgeLabel,
    variant: "modern",
    modernGradientMid: theme.modernGradientMid,
    modernGradientEnd: theme.modernGradientEnd,
  })
}

export function buildDonationConfirmationText(
  payload: DonationConfirmationEmailPayload,
): string {
  const paymentLine = payload.paymentMethodLabel
    ? `Paiement : ${formatPaymentMethodLabel(payload.paymentMethodLabel)}`
    : ""

  return finalizeTransactionEmailText([
    `Bonjour ${payload.firstName},`,
    "",
    "Merci pour votre don à Guinée À Marseille.",
    `Montant : ${formatCurrency(payload.amountEur)}`,
    paymentLine,
    payload.message ? `Votre message : ${payload.message}` : "",
    "",
    "Merci pour votre soutien.",
  ])
}
