import {
  aboutUsPublicSchema,
  type AboutUsPublicData,
} from "@/helpers/association-content/_schemas/association-content.schema"

/**
 * Charge les données « Qui sommes-nous ? » via l'API publique (client-safe).
 */
export async function fetchAboutUsPublic(): Promise<AboutUsPublicData> {
  const response = await fetch("/api/association/about-us", { cache: "no-store" })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const json: unknown = await response.json()
  return aboutUsPublicSchema.parse(json)
}
