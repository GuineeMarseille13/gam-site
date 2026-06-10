import "server-only"

import {
  getAboutUsPublicData,
  getPresidentPublicData,
} from "@/helpers/association-content/queries"
import {
  aboutUsPublicSchema,
  presidentPublicSchema,
  type AboutUsPublicData,
  type PresidentPublicData,
} from "@/helpers/association-content/_schemas/association-content.schema"

/**
 * Précharge « Le Président » depuis la base (RSC uniquement).
 */
export async function prefetchPresidentPublic(): Promise<PresidentPublicData> {
  const data = await getPresidentPublicData()
  if (!data) {
    throw new Error("Contenu non configuré")
  }
  return presidentPublicSchema.parse(data)
}

/**
 * Précharge « Qui sommes-nous ? » depuis la base (RSC uniquement).
 */
export async function prefetchAboutUsPublic(): Promise<AboutUsPublicData> {
  const data = await getAboutUsPublicData()
  if (!data) {
    throw new Error("Contenu non configuré")
  }
  return aboutUsPublicSchema.parse(data)
}
