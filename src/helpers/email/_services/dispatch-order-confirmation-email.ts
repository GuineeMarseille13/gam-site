import type { OrderConfirmationEmailPayload } from "@/helpers/email/_schemas/transaction-email.schema"
import { logEmailResultFailure } from "@/helpers/email/_utils/log-email-result"
import { sendOrderConfirmationEmail } from "@/helpers/email/_services/send-order-confirmation-email"

/**
 * Déclenche l’e-mail de confirmation de commande (non bloquant).
 */
export function dispatchOrderConfirmationEmail(
  payload: OrderConfirmationEmailPayload,
): void {
  void sendOrderConfirmationEmail(payload).then((result) => {
    logEmailResultFailure("order_confirmation_email_failed", result)
  })
}
