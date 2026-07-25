import {
  beneficiaryAutofillSchema,
  type BeneficiaryAutofill,
} from "../_schemas/beneficiary-identity-search.schema"

/**
 * Service client: fetchBeneficiaryAutofill
 * Rôle: Charger le payload d’autofill d’une fiche connue (inclut mots de passe).
 */
export async function fetchBeneficiaryAutofill(id: string): Promise<BeneficiaryAutofill> {
  const res = await fetch(`/api/administration/beneficiaries/${encodeURIComponent(id)}/autofill`, {
    method: "GET",
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error(`Erreur autofill bénéficiaire (${res.status})`)
  }

  const json: unknown = await res.json()
  return beneficiaryAutofillSchema.parse(json)
}
