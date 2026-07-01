/**
 * Extrait la première valeur d'un paramètre URL (string ou tableau).
 */
export function getFirstSearchParam(
  value: string | string[] | undefined,
): string | undefined {
  if (typeof value === "string") return value
  if (Array.isArray(value)) return value[0]
  return undefined
}
