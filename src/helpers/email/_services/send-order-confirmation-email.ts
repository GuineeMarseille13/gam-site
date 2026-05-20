import {
  orderConfirmationEmailSchema,
  type OrderConfirmationEmailPayload,
} from "@/helpers/email/_schemas/transaction-email.schema"
import {
  buildOrderConfirmationHtml,
  buildOrderConfirmationSubject,
  buildOrderConfirmationText,
} from "@/helpers/email/_templates/order-confirmation.template"
import { sendEmail, type SendEmailResult } from "@/lib/email/send-email"

/**
 * Envoie la confirmation de commande boutique au client.
 */
export async function sendOrderConfirmationEmail(
  rawPayload: unknown,
): Promise<SendEmailResult> {
  const payload: OrderConfirmationEmailPayload =
    orderConfirmationEmailSchema.parse(rawPayload)

  return sendEmail({
    to: payload.to,
    subject: buildOrderConfirmationSubject(payload.orderNumber),
    html: buildOrderConfirmationHtml(payload),
    text: buildOrderConfirmationText(payload),
    idempotencyKey: `order-confirmation/${payload.paymentReference}`,
    tags: [
      { name: "category", value: "order_confirmation" },
      { name: "order_number", value: payload.orderNumber.slice(0, 256) },
    ],
  })
}
