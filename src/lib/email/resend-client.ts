import { Resend } from "resend"

import { getEmailEnv, isEmailConfigured } from "@/config/env"

let resendClient: Resend | null = null

/**
 * Client Resend singleton (serveur uniquement).
 */
export function getResendClient(): Resend | null {
  if (!isEmailConfigured()) {
    return null
  }

  if (!resendClient) {
    const { RESEND_API_KEY } = getEmailEnv()
    if (!RESEND_API_KEY) {
      return null
    }
    resendClient = new Resend(RESEND_API_KEY)
  }

  return resendClient
}
