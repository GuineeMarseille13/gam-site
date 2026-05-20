import type { SendEmailResult } from "@/lib/email/send-email"
import { logger } from "@/lib/logger"

/**
 * Journalise un échec d’envoi (hors skip configuration).
 */
export function logEmailResultFailure(
  context: string,
  result: SendEmailResult,
): void {
  if (result.success || result.skipped) {
    return
  }
  logger.error(context, { error: result.error })
}
