import { EMAIL_PHONE_NUMBER, EMAIL_REPLY_TO, EMAIL_SENDER_NAME } from "@/config/email"
import { escapeHtml } from "@/helpers/email/_templates/escape-html"
import { buildInvoiceNoticeHtml } from "@/helpers/email/_templates/transaction-email-notices"
import { EMAIL_BLUE_MODERN_SHELL } from "@/helpers/email/_templates/transaction-email-styles"

export type EmailLayoutVariant = "classic" | "modern"

interface EmailModernShell {
  pageBackground: string
  outerBorder: string
  footerBackground: string
}

interface EmailLayoutOptions {
  previewText: string
  title: string
  bodyHtml: string
  accentColor: string
  accentSoft: string
  badgeLabel: string
  /** En-tête dégradé sans logo (adhésion, don, etc.). */
  variant?: EmailLayoutVariant
  modernGradientMid?: string
  modernGradientEnd?: string
  /** Fond / bordure de l’enveloppe en variant modern (défaut : bleu). */
  modernShell?: EmailModernShell
}

function buildClassicHeader(
  accentColor: string,
  accentSoft: string,
  safeBadge: string,
): string {
  return `
            <tr>
              <td style="padding:28px 32px 20px;background:${accentSoft};border-bottom:1px solid #e4e4e7;">
                <p style="margin:0 0 12px;font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${accentColor};">${safeBadge}</p>
                <p style="margin:0;font-size:20px;font-weight:700;color:#18181b;">${escapeHtml(EMAIL_SENDER_NAME)}</p>
              </td>
            </tr>`
}

function buildModernHeader(
  accentColor: string,
  safeBadge: string,
  gradientMid: string,
  gradientEnd: string,
): string {
  return `
            <tr>
              <td style="padding:28px 32px 24px;background:linear-gradient(145deg, ${accentColor} 0%, ${gradientMid} 52%, ${gradientEnd} 100%);">
                <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.9);">${safeBadge}</p>
                <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;">${escapeHtml(EMAIL_SENDER_NAME)}</p>
              </td>
            </tr>`
}

function buildBodyRow(bodyHtml: string): string {
  return `
            <tr>
              <td style="padding:28px 32px 8px;font-size:15px;line-height:1.65;color:#3f3f46;">
                ${bodyHtml}
                ${buildInvoiceNoticeHtml()}
              </td>
            </tr>`
}

function buildFooterRow(
  variant: EmailLayoutVariant,
  year: number,
  modernFooterBg: string,
): string {
  const footerBg = variant === "modern" ? modernFooterBg : "#fafafa"

  return `
            <tr>
              <td style="padding:18px 32px 28px;font-size:12px;color:#71717a;border-top:1px solid #e4e4e7;background:${footerBg};">
                Cet e-mail confirme une opération effectuée sur notre site. En cas de question, contactez-nous par e-mail: <a href="mailto:${EMAIL_REPLY_TO}">${EMAIL_REPLY_TO}</a> ou par téléphone: <a href="tel:${EMAIL_PHONE_NUMBER}">${EMAIL_PHONE_NUMBER}</a>.<br /><br />
                © ${year} ${escapeHtml(EMAIL_SENDER_NAME)}
              </td>
            </tr>`
}

/**
 * Enveloppe HTML commune pour les e-mails transactionnels post-paiement.
 */
export function wrapEmailLayout({
  previewText,
  title,
  bodyHtml,
  accentColor,
  accentSoft,
  badgeLabel,
  variant = "classic",
  modernGradientMid = "#1d4ed8",
  modernGradientEnd = "#1e3a8a",
  modernShell = EMAIL_BLUE_MODERN_SHELL,
}: EmailLayoutOptions): string {
  const safePreview = escapeHtml(previewText)
  const safeTitle = escapeHtml(title)
  const safeBadge = escapeHtml(badgeLabel)
  const year = new Date().getFullYear()
  const shell = modernShell
  const headerHtml =
    variant === "modern"
      ? buildModernHeader(accentColor, safeBadge, modernGradientMid, modernGradientEnd)
      : buildClassicHeader(accentColor, accentSoft, safeBadge)
  const outerBorder =
    variant === "modern" ? shell.outerBorder : "border:1px solid #e4e4e7;"
  const outerRadius = variant === "modern" ? "20px" : "16px"
  const pageBackground = variant === "modern" ? shell.pageBackground : "#eef2ff"

  return `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>${safeTitle}</title>
  </head>
  <body style="margin:0;padding:0;background:${pageBackground};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,Helvetica,sans-serif;color:#18181b;">
    <span style="display:none;max-height:0;overflow:hidden;">${safePreview}</span>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${pageBackground};padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:${outerRadius};${outerBorder}overflow:hidden;">
            ${headerHtml}
            ${buildBodyRow(bodyHtml)}
            ${buildFooterRow(variant, year, shell.footerBackground)}
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}
