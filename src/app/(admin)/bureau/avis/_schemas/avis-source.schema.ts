import type { AvisSourceType } from "./avis-form.schema"

/**
 * Déduit le type d’origine à partir des valeurs en base.
 */
export function inferAvisSourceType(
  sourceLabel: string | null | undefined,
  sourceImageUrl: string | null | undefined,
): AvisSourceType {
  if (sourceImageUrl?.trim()) return "image"
  if (sourceLabel?.trim()) return "text"
  return "none"
}
