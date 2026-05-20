export { dispatchAdhesionConfirmationEmail } from "@/helpers/email/_services/dispatch-adhesion-confirmation-email"
export { dispatchDonationConfirmationEmail } from "@/helpers/email/_services/dispatch-donation-confirmation-email"
export { dispatchOrderConfirmationEmail } from "@/helpers/email/_services/dispatch-order-confirmation-email"
export { sendAdhesionConfirmationEmail } from "@/helpers/email/_services/send-adhesion-confirmation-email"
export { sendDonationConfirmationEmail } from "@/helpers/email/_services/send-donation-confirmation-email"
export { sendOrderConfirmationEmail } from "@/helpers/email/_services/send-order-confirmation-email"
export type {
  AdhesionConfirmationEmailPayload,
  DonationConfirmationEmailPayload,
  OrderConfirmationEmailPayload,
} from "@/helpers/email/_schemas/transaction-email.schema"
export { isEmailConfigured } from "@/config/env"
export type { SendEmailResult } from "@/lib/email/send-email"
export { sendEmail } from "@/lib/email/send-email"
