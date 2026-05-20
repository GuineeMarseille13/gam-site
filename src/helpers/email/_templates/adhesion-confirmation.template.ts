import { EMAIL_SUBJECTS, EMAIL_TRANSACTION_THEMES } from "@/config/email"
import { formatPaymentMethodLabel } from "@/config/bureau-payment-methods"
import type { AdhesionConfirmationEmailPayload } from "@/helpers/email/_schemas/transaction-email.schema"
import { escapeHtml } from "@/helpers/email/_templates/escape-html"
import { wrapEmailLayout } from "@/helpers/email/_templates/email-layout"
import { finalizeTransactionEmailText } from "@/helpers/email/_templates/transaction-email-notices"
import { formatCurrency } from "@/helpers/format-currency"

const theme = EMAIL_TRANSACTION_THEMES.adhesion

function buildMembersListHtml(members: AdhesionConfirmationEmailPayload["members"]): string {
  const rows = members
    .map((member, index) => {
      const isLast = index === members.length - 1
      const borderStyle = isLast ? "" : "border-bottom:1px solid #e0e7ff;"

      return `
        <tr>
          <td style="padding:12px 16px;${borderStyle}font-weight:500;color:#18181b;">
            ${escapeHtml(`${member.firstName} ${member.lastName}`)}
          </td>
          <td style="padding:12px 16px;${borderStyle}color:#475569;">
            ${escapeHtml(member.phone ?? "—")}
          </td>
        </tr>`
    })
    .join("")

  return rows
}

function buildPaymentChip(paymentMethodLabel: string): string {
  const label = escapeHtml(formatPaymentMethodLabel(paymentMethodLabel))

  return `
    <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 24px;">
      <tr>
        <td style="padding:8px 14px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:999px;font-size:13px;color:#1e40af;">
          <span style="color:#64748b;">Paiement ·</span> <strong>${label}</strong>
        </td>
      </tr>
    </table>`
}

export function buildAdhesionConfirmationSubject(): string {
  return EMAIL_SUBJECTS.adhesionConfirmation
}

export function buildAdhesionConfirmationHtml(
  payload: AdhesionConfirmationEmailPayload,
): string {
  const firstName = escapeHtml(payload.recipientFirstName)
  const year = payload.membershipYear
  const total = formatCurrency(payload.totalAmountEur)
  const memberLabel = payload.members.length > 1 ? "adhérents" : "adhérent"
  const paymentChip = payload.paymentMethodLabel
    ? buildPaymentChip(payload.paymentMethodLabel)
    : ""

  const bodyHtml = `
    <h1 style="margin:0 0 10px;font-size:24px;font-weight:700;color:#0f172a;letter-spacing:-0.02em;">Bienvenue, ${firstName}</h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#475569;">
      Votre adhésion à <strong style="color:#1e3a8a;">Guinée À Marseille</strong> pour l’année
      <strong style="color:#1e3a8a;">${year}</strong> est confirmée. Merci de soutenir nos actions !
    </p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 24px;background:linear-gradient(180deg, #eff6ff 0%, #ffffff 100%);border:1px solid #bfdbfe;border-radius:16px;">
      <tr>
        <td style="padding:22px 24px;">
          <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#3b82f6;text-transform:uppercase;letter-spacing:0.1em;">Montant total</p>
          <p style="margin:0;font-size:34px;font-weight:800;color:${theme.accentColor};letter-spacing:-0.03em;line-height:1.1;">${escapeHtml(total)}</p>
          <p style="margin:10px 0 0;font-size:13px;color:#64748b;">${payload.members.length} ${memberLabel}</p>
        </td>
      </tr>
    </table>
    ${paymentChip}
    <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#0f172a;text-transform:uppercase;letter-spacing:0.06em;">Personnes adhérentes</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0;border:1px solid #c7d2fe;border-radius:14px;overflow:hidden;background:#ffffff;">
      <tr style="background:linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%);">
        <th align="left" style="padding:11px 16px;font-size:11px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:0.06em;">Nom</th>
        <th align="left" style="padding:11px 16px;font-size:11px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:0.06em;">Téléphone</th>
      </tr>
      ${buildMembersListHtml(payload.members)}
    </table>`

  return wrapEmailLayout({
    previewText: `Adhésion ${year} confirmée — ${total}`,
    title: EMAIL_SUBJECTS.adhesionConfirmation,
    bodyHtml,
    accentColor: theme.accentColor,
    accentSoft: theme.accentSoft,
    badgeLabel: theme.badgeLabel,
    variant: "modern",
    modernGradientMid: theme.modernGradientMid,
    modernGradientEnd: theme.modernGradientEnd,
  })
}

export function buildAdhesionConfirmationText(
  payload: AdhesionConfirmationEmailPayload,
): string {
  const membersLines = payload.members
    .map((m) => `- ${m.firstName} ${m.lastName}${m.phone ? ` (${m.phone})` : ""}`)
    .join("\n")

  const paymentLine = payload.paymentMethodLabel
    ? `Paiement : ${formatPaymentMethodLabel(payload.paymentMethodLabel)}`
    : ""

  return finalizeTransactionEmailText([
    `Bonjour ${payload.recipientFirstName},`,
    "",
    `Votre adhésion pour l'année ${payload.membershipYear} est confirmée.`,
    `Montant total : ${formatCurrency(payload.totalAmountEur)}`,
    paymentLine,
    "",
    "Personnes adhérentes :",
    membersLines,
    "",
    "Merci pour votre confiance.",
  ])
}
