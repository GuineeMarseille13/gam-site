import {
  presidentPublicSchema,
  type PresidentPublicData,
} from "@/helpers/association-content/_schemas/association-content.schema"

/**
 * Charge les données « Le Président » via l'API publique (client-safe).
 */
export async function fetchPresidentPublic(): Promise<PresidentPublicData> {
  const response = await fetch("/api/association/president", { cache: "no-store" })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const json: unknown = await response.json()
  return presidentPublicSchema.parse(json)
}
