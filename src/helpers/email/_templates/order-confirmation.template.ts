import { EMAIL_SUBJECTS, EMAIL_TRANSACTION_THEMES } from "@/config/email"
import { formatPaymentMethodLabel } from "@/config/bureau-payment-methods"
import type { OrderConfirmationEmailPayload } from "@/helpers/email/_schemas/transaction-email.schema"
import { escapeHtml } from "@/helpers/email/_templates/escape-html"
import { wrapEmailLayout } from "@/helpers/email/_templates/email-layout"
import {
  buildOrderPaymentChip,
  EMAIL_ORDER_MODERN_PALETTE,
  EMAIL_ORDER_MODERN_SHELL,
} from "@/helpers/email/_templates/transaction-email-styles"
import { finalizeTransactionEmailText } from "@/helpers/email/_templates/transaction-email-notices"
import { formatCurrency } from "@/helpers/format-currency"

const theme = EMAIL_TRANSACTION_THEMES.order
const palette = EMAIL_ORDER_MODERN_PALETTE

function buildOrderLinesHtml(lines: OrderConfirmationEmailPayload["lines"]): string {
  return lines
    .map((line, index) => {
      const isLast = index === lines.length - 1
      const borderStyle = isLast ? "" : `border-bottom:1px solid ${palette.tableRowBorder};`

      return `
        <tr>
          <td style="padding:12px 16px;${borderStyle}font-weight:500;color:${palette.brandStrong};">
            ${escapeHtml(line.productName)}
            <span style="color:${palette.textSubtle};font-weight:400;"> × ${line.quantity}</span>
          </td>
          <td align="right" style="padding:12px 16px;${borderStyle}font-weight:600;color:${palette.textStrong};">
            ${escapeHtml(formatCurrency(line.lineTotalCents, { unit: "cent" }))}
          </td>
        </tr>`
    })
    .join("")
}

export function buildOrderConfirmationSubject(orderNumber: string): string {
  return `${EMAIL_SUBJECTS.orderConfirmation} — ${orderNumber}`
}

export function buildOrderConfirmationHtml(payload: OrderConfirmationEmailPayload): string {
  const firstName = escapeHtml(payload.firstName)
  const orderNumber = escapeHtml(payload.orderNumber)
  const total = formatCurrency(payload.totalAmountCents, { unit: "cent" })
  const articleLabel = payload.lines.length > 1 ? "articles" : "article"
  const paymentChip = payload.paymentMethodLabel
    ? buildOrderPaymentChip(payload.paymentMethodLabel)
    : ""

  const bodyHtml = `
    <h1 style="margin:0 0 10px;font-size:24px;font-weight:700;color:${palette.textStrong};letter-spacing:-0.02em;">Merci, ${firstName}</h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:${palette.textMuted};">
      Votre commande sur la boutique <strong style="color:${palette.brandStrong};">Guinée À Marseille</strong> est confirmée.
      Nous préparons votre colis avec soin.
    </p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 24px;background:${palette.cardBackground};border:1px solid ${palette.cardBorder};border-radius:16px;">
      <tr>
        <td style="padding:22px 24px;">
          <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:${palette.labelAccent};text-transform:uppercase;letter-spacing:0.1em;">Montant total</p>
          <p style="margin:0;font-size:34px;font-weight:800;color:${palette.accentColor};letter-spacing:-0.03em;line-height:1.1;">${escapeHtml(total)}</p>
          <p style="margin:10px 0 0;font-size:13px;color:${palette.textSubtle};">Commande · <strong style="color:${palette.textStrong};">${orderNumber}</strong> · ${payload.lines.length} ${articleLabel}</p>
        </td>
      </tr>
    </table>
    ${paymentChip}
    <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:${palette.textStrong};text-transform:uppercase;letter-spacing:0.06em;">Articles commandés</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0;border:1px solid ${palette.tableBorder};border-radius:14px;overflow:hidden;background:#ffffff;">
      <tr style="background:${palette.tableHeaderGradient};">
        <th align="left" style="padding:11px 16px;font-size:11px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:0.06em;">Article</th>
        <th align="right" style="padding:11px 16px;font-size:11px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:0.06em;">Sous-total</th>
      </tr>
      ${buildOrderLinesHtml(payload.lines)}
    </table>`

  return wrapEmailLayout({
    previewText: `Commande ${payload.orderNumber} confirmée — ${total}`,
    title: buildOrderConfirmationSubject(payload.orderNumber),
    bodyHtml,
    accentColor: theme.accentColor,
    accentSoft: theme.accentSoft,
    badgeLabel: theme.badgeLabel,
    variant: "modern",
    modernGradientMid: theme.modernGradientMid,
    modernGradientEnd: theme.modernGradientEnd,
    modernShell: EMAIL_ORDER_MODERN_SHELL,
  })
}

export function buildOrderConfirmationText(payload: OrderConfirmationEmailPayload): string {
  const linesText = payload.lines
    .map(
      (line) =>
        `- ${line.productName} × ${line.quantity} : ${formatCurrency(line.lineTotalCents, { unit: "cent" })}`,
    )
    .join("\n")

  const paymentLine = payload.paymentMethodLabel
    ? `Paiement : ${formatPaymentMethodLabel(payload.paymentMethodLabel)}`
    : ""

  return finalizeTransactionEmailText([
    `Bonjour ${payload.firstName},`,
    "",
    `Votre commande ${payload.orderNumber} est confirmée.`,
    "",
    "Articles :",
    linesText,
    "",
    `Total : ${formatCurrency(payload.totalAmountCents, { unit: "cent" })}`,
    paymentLine,
    "",
    "Merci pour votre commande.",
  ])
}
