import {
  type BureauPoleContentSlug,
  isBureauPoleContentSlug,
} from "@/config/bureau-poles-content"
import { getBureauPoleAchievementsUi } from "@/config/bureau-pole-achievements-ui"
import type { BureauPoleDetailsSection } from "@/helpers/details-pole-bureau/_schemas/details-pole-bureau-section.schema"

export type BureauPoleDetailsSectionUi = {
  fieldLabel: string
  editorHelper: string
  placeholder?: string
}

/**
 * Libellés et aides pour l’édition bureau des sections `DetailsPole` (une source pour le formulaire).
 */
export const BUREAU_POLE_DETAILS_SECTION_UI: Record<
  BureauPoleDetailsSection,
  BureauPoleDetailsSectionUi
> = {
  about: {
    fieldLabel: "Contenu « À propos »",
    editorHelper:
      "Remplace le paragraphe sous le badge « À propos » sur la page publique. Laissez vide et enregistrez pour revenir au texte statique du site.",
    placeholder:
      "Présentez le pôle, sa mission et ce que les visiteurs peuvent attendre de cette page…",
  },
  achievements: {
    fieldLabel: "Texte d’introduction « Nos réalisations »",
    editorHelper: "Remplace le sous-titre par défaut de la section.",
    placeholder: "Saisissez le texte affiché sous le titre « Nos réalisations »…",
  },
}

/**
 * UI d’édition d’une section bureau, contextualisée par pôle lorsque disponible.
 */
export function getBureauPoleDetailsSectionUi(
  poleSlug: string,
  section: BureauPoleDetailsSection,
): BureauPoleDetailsSectionUi {
  if (section === "achievements" && isBureauPoleContentSlug(poleSlug)) {
    const intro = getBureauPoleAchievementsUi(poleSlug as BureauPoleContentSlug).intro
    return {
      fieldLabel: intro.fieldLabel,
      editorHelper: intro.editorHelper,
      placeholder: intro.placeholder,
    }
  }

  return BUREAU_POLE_DETAILS_SECTION_UI[section]
}
