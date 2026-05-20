import { z } from "zod"

/**
 * Retourne une adresse e-mail valide ou null si absente / invalide.
 */
export function normalizeRecipientEmail(value?: string | null): string | null {
  const trimmed = value?.trim()
  if (!trimmed) {
    return null
  }

  const parsed = z.string().email().safeParse(trimmed)
  return parsed.success ? parsed.data : null
}
