/**
 * Extrait un message d’erreur lisible depuis une réponse JSON d’API adhésion.
 */
export function fetchAdhesionApiError(
  json: unknown,
  fallback: string,
): string {
  if (typeof json === "object" && json !== null && "error" in json) {
    const message = String((json as { error?: unknown }).error ?? "")
    if (message) return message
  }
  return fallback
}
