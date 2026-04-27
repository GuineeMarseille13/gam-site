/**
 * Transforme l'erreur renvoyée par Better Auth / better-fetch en message affichable.
 * Le rôle utilisateur (admin, etc.) n'intervient qu'après une authentification réussie.
 */
export function formatAuthSignInError(error: unknown): string {
  if (error == null) {
    return "Les identifiants sont incorrects."
  }

  if (typeof error === "string") {
    return error.length > 0 && error.length < 280 ? error : "Les identifiants sont incorrects."
  }

  if (typeof error !== "object") {
    return "Les identifiants sont incorrects."
  }

  const e = error as Record<string, unknown>
  const nested = e.error
  const raw =
    (typeof e.message === "string" ? e.message : "") ||
    (nested &&
    typeof nested === "object" &&
    nested !== null &&
    typeof (nested as { message?: string }).message === "string"
      ? (nested as { message: string }).message
      : "") ||
    ""

  const lower = raw.toLowerCase()
  if (lower.includes("banned") || lower.includes("suspend")) {
    return "Ce compte est suspendu. Contactez un administrateur."
  }

  /** Better Auth log côté serveur : « User not found » — l’API peut renvoyer un message équivalent */
  if (
    lower.includes("user not found") ||
    lower.includes("no user") ||
    lower.includes("aucun utilisateur")
  ) {
    return "Aucun compte ne correspond à cet email. Créez un compte depuis le bureau (Membres) ou vérifiez l'adresse."
  }

  if (raw.length > 0 && raw.length < 240) {
    return raw
  }

  return "Les identifiants sont incorrects."
}
