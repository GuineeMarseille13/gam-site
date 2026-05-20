import { EMAIL_INVOICE_NOTICE_TEXT, EMAIL_SENDER_NAME } from "@/config/email"
import { escapeHtml } from "@/helpers/email/_templates/escape-html"

/**
 * Encart HTML : demande de facture auprès de l’association.
 */
export function buildInvoiceNoticeHtml(): string {
  const associationName = escapeHtml(EMAIL_SENDER_NAME)

  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:20px 0 0;border:1px solid #e4e4e7;border-radius:10px;background:#fafafa;">
      <tr>
        <td style="padding:14px 16px;font-size:14px;line-height:1.55;color:#52525b;">
          <strong style="color:#18181b;">Facture</strong> — Si vous en avez besoin, merci de bien vouloir
          contacter l’association (<strong>${associationName}</strong>) via nos coordonnées sur le site.
        </td>
      </tr>
    </table>`
}

/**
 * Assemble le corps texte brut avec la mention facture en fin de message.
 */
export function finalizeTransactionEmailText(lines: readonly string[]): string {
  const body = lines.filter((line) => line.length > 0).join("\n")
  return `${body}\n\n${EMAIL_INVOICE_NOTICE_TEXT}`
}
