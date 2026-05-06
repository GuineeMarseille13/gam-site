import type { BureauPoleDetailsSection } from "@/helpers/details-pole-bureau/_schemas/details-pole-bureau-section.schema"

/**
 * Libellés et aides pour l’édition bureau des sections `DetailsPole` (une source pour le formulaire).
 */
export const BUREAU_POLE_DETAILS_SECTION_UI: Record<
  BureauPoleDetailsSection,
  { fieldLabel: string; editorHelper: string }
> = {
  about: {
    fieldLabel: "Contenu « À propos »",
    editorHelper:
      "Remplace le paragraphe sous le badge « À propos » sur la page publique. Laissez vide et enregistrez pour revenir au texte statique du site.",
  },
  services: {
    fieldLabel: "Texte d’introduction « Nos services »",
    editorHelper:
      "S’affiche au-dessus de la grille des cartes services. Vide = pas de texte libre, seules les cartes statiques s’affichent.",
  },
  achievements: {
    fieldLabel: "Texte d’introduction « Nos réalisations »",
    editorHelper:
      "Remplace le sous-titre par défaut de la section. Si la galerie d’images est vide, ce texte peut constituer la section seule.",
  },
}
