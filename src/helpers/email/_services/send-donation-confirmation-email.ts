import {
  donationConfirmationEmailSchema,
  type DonationConfirmationEmailPayload,
} from "@/helpers/email/_schemas/transaction-email.schema"
import {
  buildDonationConfirmationHtml,
  buildDonationConfirmationSubject,
  buildDonationConfirmationText,
} from "@/helpers/email/_templates/donation-confirmation.template"
import { sendEmail, type SendEmailResult } from "@/lib/email/send-email"

/**
 * Envoie la confirmation de don au donateur.
 */
export async function sendDonationConfirmationEmail(
  rawPayload: unknown,
): Promise<SendEmailResult> {
  const payload: DonationConfirmationEmailPayload =
    donationConfirmationEmailSchema.parse(rawPayload)

  return sendEmail({
    to: payload.to,
    subject: buildDonationConfirmationSubject(),
    html: buildDonationConfirmationHtml(payload),
    text: buildDonationConfirmationText(payload),
    idempotencyKey: `donation-confirmation/${payload.paymentReference}`,
    tags: [
      { name: "category", value: "donation_confirmation" },
      { name: "payment_reference", value: payload.paymentReference.slice(0, 256) },
    ],
  })
}
