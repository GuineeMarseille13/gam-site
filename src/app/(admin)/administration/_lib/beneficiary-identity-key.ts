/**
 * Clé soft d’identité bénéficiaire (alignée recherche autofill / groupement suivi).
 * Prénom + nom + date de naissance + téléphone, normalisés.
 */

function normalizePart(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ")
}

export interface BeneficiaryIdentityParts {
  firstName: string
  lastName: string
  birthDate: string | null
  phone: string | null
}

/**
 * Construit la clé d’identité soft pour regrouper les fiches d’une même personne.
 */
export function buildBeneficiaryIdentityKey(parts: BeneficiaryIdentityParts): string {
  const phone = parts.phone?.trim()
  return [
    normalizePart(parts.firstName),
    normalizePart(parts.lastName),
    parts.birthDate ?? "",
    phone ? normalizePart(phone) : "",
  ].join("|")
}
