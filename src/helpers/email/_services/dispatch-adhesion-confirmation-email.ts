import type { Member } from "@/app/(public)/adhesion/_schemas/adhesion.schema"
import { buildAdhesionEmailPayload } from "@/helpers/email/_utils/build-adhesion-email-payload"
import { logEmailResultFailure } from "@/helpers/email/_utils/log-email-result"
import { sendAdhesionConfirmationEmail } from "@/helpers/email/_services/send-adhesion-confirmation-email"

interface DispatchAdhesionConfirmationEmailInput {
  members: Member[]
  totalAmountEur: number
  paymentReference: string
  membershipYear?: number
  paymentMethodLabel?: string
}

/**
 * Déclenche l’e-mail de confirmation d’adhésion (non bloquant).
 */
export function dispatchAdhesionConfirmationEmail(
  input: DispatchAdhesionConfirmationEmailInput,
): void {
  const payload = buildAdhesionEmailPayload(input)
  if (!payload) {
    return
  }

  void sendAdhesionConfirmationEmail(payload).then((result) => {
    logEmailResultFailure("adhesion_confirmation_email_failed", result)
  })
}
