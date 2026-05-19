import { BUREAU_POLE_CONTENT_ENTRIES } from "@/config/bureau-poles-content"
import { poles } from "@/data/poles"

/**
 * Titres publics canoniques par `public_slug` (cartes accueil, hero, listes bureau).
 */
const POLE_DISPLAY_TITLE_BY_SLUG: Record<string, string> = {
  ...Object.fromEntries(
    BUREAU_POLE_CONTENT_ENTRIES.map((entry) => [entry.slug, entry.metaTitle]),
  ),
  ...Object.fromEntries(
    poles
      .filter((p): p is typeof p & { displayTitle: string } => !!p.displayTitle?.trim())
      .map((p) => [p.slug, p.displayTitle.trim()]),
  ),
}

const LEGACY_MISE_EN_RELATION_TITLE = POLE_DISPLAY_TITLE_BY_SLUG["mise-en-relation"]

function resolveLegacyPoleTitle(fallbackName?: string | null): string | null {
  if (!fallbackName?.trim() || !LEGACY_MISE_EN_RELATION_TITLE) {
    return null
  }

  const normalized = fallbackName.trim().toLowerCase()
  const isOldMiseEnRelationLabel =
    normalized === "mise en relation" ||
    (normalized.includes("mise") &&
      normalized.includes("relation") &&
      !normalized.includes("hébergement") &&
      !normalized.includes("hebergement"))

  if (!isOldMiseEnRelationLabel) {
    return null
  }

  return LEGACY_MISE_EN_RELATION_TITLE
}

/**
 * Titre affiché pour un pôle (carte accueil, hero, listes).
 */
export function getPolePublicDisplayTitle(
  publicSlug: string,
  fallbackName?: string | null,
): string {
  const slug = publicSlug.trim()
  const fromCatalog = POLE_DISPLAY_TITLE_BY_SLUG[slug]
  if (fromCatalog) {
    return fromCatalog
  }

  const legacy = resolveLegacyPoleTitle(fallbackName)
  if (legacy) {
    return legacy
  }

  const staticPole = poles.find((p) => p.slug === slug)
  if (staticPole?.displayTitle?.trim()) {
    return staticPole.displayTitle.trim()
  }

  if (fallbackName?.trim()) {
    return fallbackName.trim()
  }

  if (staticPole?.title) {
    return formatScreamingTitle(staticPole.title)
  }

  return "Pôle"
}

function formatScreamingTitle(value: string): string {
  const lower = value.trim().toLowerCase()
  if (!lower) return value
  return lower.charAt(0).toUpperCase() + lower.slice(1)
}
