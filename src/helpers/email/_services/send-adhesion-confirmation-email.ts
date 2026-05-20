import {
  adhesionConfirmationEmailSchema,
  type AdhesionConfirmationEmailPayload,
} from "@/helpers/email/_schemas/transaction-email.schema"
import {
  buildAdhesionConfirmationHtml,
  buildAdhesionConfirmationSubject,
  buildAdhesionConfirmationText,
} from "@/helpers/email/_templates/adhesion-confirmation.template"
import { sendEmail, type SendEmailResult } from "@/lib/email/send-email"

/**
 * Envoie la confirmation d’adhésion au membre principal (ou premier e-mail valide).
 */
export async function sendAdhesionConfirmationEmail(
  rawPayload: unknown,
): Promise<SendEmailResult> {
  const payload: AdhesionConfirmationEmailPayload =
    adhesionConfirmationEmailSchema.parse(rawPayload)

  return sendEmail({
    to: payload.to,
    subject: buildAdhesionConfirmationSubject(),
    html: buildAdhesionConfirmationHtml(payload),
    text: buildAdhesionConfirmationText(payload),
    idempotencyKey: `adhesion-confirmation/${payload.paymentReference}`,
    tags: [
      { name: "category", value: "adhesion_confirmation" },
      { name: "payment_reference", value: payload.paymentReference.slice(0, 256) },
    ],
  })
}
