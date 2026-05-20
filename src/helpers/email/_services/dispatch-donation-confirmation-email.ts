import type { DonPayload } from "@/app/(public)/don/_schemas/don.schema"
import { normalizeRecipientEmail } from "@/helpers/email/_utils/normalize-recipient-email"
import { logEmailResultFailure } from "@/helpers/email/_utils/log-email-result"
import { sendDonationConfirmationEmail } from "@/helpers/email/_services/send-donation-confirmation-email"

interface DispatchDonationConfirmationEmailInput {
  donor: DonPayload
  paymentReference: string
  paymentMethodLabel?: string
}

/**
 * Déclenche l’e-mail de confirmation de don (non bloquant).
 */
export function dispatchDonationConfirmationEmail(
  input: DispatchDonationConfirmationEmailInput,
): void {
  const to = normalizeRecipientEmail(input.donor.email)
  if (!to) {
    return
  }

  void sendDonationConfirmationEmail({
    to,
    firstName: input.donor.firstName.trim(),
    lastName: input.donor.lastName.trim(),
    amountEur: input.donor.amount,
    message: input.donor.message?.trim() || undefined,
    paymentReference: input.paymentReference,
    paymentMethodLabel: input.paymentMethodLabel,
  }).then((result) => {
    logEmailResultFailure("donation_confirmation_email_failed", result)
  })
}
