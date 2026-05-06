import type { Pole } from "@/data/poles"

import type { BureauPoleDetailsSection } from "./_schemas/details-pole-bureau-section.schema"

/**
 * Extrait indicatif affiché sous le formulaire (données statiques `poles.ts`).
 */
export function getStaticFallbackBlurbForSection(
  pole: Pole,
  section: BureauPoleDetailsSection,
): string {
  if (section === "about") {
    return pole.description
  }

  if (section === "services") {
    const first = pole.services[0]
    if (first) {
      return `${first.title} — ${first.description}`
    }
    return pole.shortDescription
  }

  return "Découvrez les moments forts de nos événements et l'impact de notre travail."
}
