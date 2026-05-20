import { EMAIL_SENDER_NAME } from "@/config/email"
import { getEmailEnv, isEmailConfigured } from "@/config/env"
import {
  sendEmailPayloadSchema,
  type SendEmailPayload,
} from "@/helpers/email/_schemas/send-email.schema"
import { logger } from "@/lib/logger"
import { getResendClient } from "@/lib/email/resend-client"

export type SendEmailResult =
  | { success: true; id: string }
  | { success: false; error: string; skipped?: boolean }

function buildFromAddress(): string {
  const env = getEmailEnv()
  const email = env.RESEND_FROM_EMAIL
  if (!email) {
    return ""
  }
  const name = env.RESEND_FROM_NAME ?? EMAIL_SENDER_NAME
  return `${name} <${email}>`
}

function normalizeRecipients(to: SendEmailPayload["to"]): string[] {
  return Array.isArray(to) ? to : [to]
}

/**
 * Envoie un e-mail via Resend (validation Zod + gestion { data, error }).
 */
export async function sendEmail(rawPayload: unknown): Promise<SendEmailResult> {
  if (!isEmailConfigured()) {
    logger.warn("email_skipped_not_configured")
    return { success: false, error: "EMAIL_NOT_CONFIGURED", skipped: true }
  }

  const parsed = sendEmailPayloadSchema.safeParse(rawPayload)
  if (!parsed.success) {
    return { success: false, error: "INVALID_EMAIL_PAYLOAD" }
  }

  const client = getResendClient()
  if (!client) {
    return { success: false, error: "EMAIL_CLIENT_UNAVAILABLE", skipped: true }
  }

  const env = getEmailEnv()
  const payload = parsed.data
  const from = buildFromAddress()

  const requestOptions = payload.idempotencyKey
    ? { idempotencyKey: payload.idempotencyKey }
    : undefined

  const { data, error } = await client.emails.send(
    {
      from,
      to: normalizeRecipients(payload.to),
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      replyTo: payload.replyTo ?? env.EMAIL_REPLY_TO,
      tags: payload.tags,
    },
    requestOptions,
  )

  if (error) {
    logger.error("email_send_failed", { message: error.message })
    return { success: false, error: error.message }
  }

  if (!data?.id) {
    return { success: false, error: "EMAIL_SEND_NO_ID" }
  }

  return { success: true, id: data.id }
}
