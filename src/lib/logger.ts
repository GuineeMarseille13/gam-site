type LogContext = Record<string, string | number | boolean | undefined>

/**
 * Journalisation serveur minimale (sans données sensibles en prod).
 */
export const logger = {
  error(message: string, context?: LogContext): void {
    if (process.env.NODE_ENV === "production") {
      console.error(message, context ?? {})
      return
    }
    console.error(message, context ?? {})
  },
  warn(message: string, context?: LogContext): void {
    if (process.env.NODE_ENV === "production") {
      return
    }
    console.warn(message, context ?? {})
  },
}
