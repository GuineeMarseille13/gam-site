import { BUREAU_POLE_CONTENT_SLUGS } from "@/config/bureau-poles-content"
import type { BureauPoleContentSlug } from "@/config/bureau-poles-content"
import { slugify } from "@/lib/slugify"

/**
 * Déduit le `public_slug` d’un pôle à partir de son nom (création / import).
 */
export function inferPolePublicSlugFromName(name: string): BureauPoleContentSlug | null {
  const trimmed = name.trim()
  if (!trimmed) {
    return null
  }

  const fromSlugify = slugify(trimmed)
  if (BUREAU_POLE_CONTENT_SLUGS.includes(fromSlugify as BureauPoleContentSlug)) {
    return fromSlugify as BureauPoleContentSlug
  }

  for (const slug of BUREAU_POLE_CONTENT_SLUGS) {
    if (nameMatchesKnownPoleSlug(trimmed, slug)) {
      return slug
    }
  }

  return null
}

function nameMatchesKnownPoleSlug(name: string, slug: BureauPoleContentSlug): boolean {
  const n = name.toLowerCase()

  switch (slug) {
    case "evenementiel":
      return n.includes("événementiel") || n.includes("evenementiel")
    case "demarche-administrative":
      return (
        (n.includes("démarche") || n.includes("demarche")) &&
        (n.includes("administratif") || n.includes("administrative"))
      )
    case "mise-en-relation":
      return (
        (n.includes("mise") && n.includes("relation")) ||
        n.includes("hébergement") ||
        n.includes("hebergement")
      )
    default:
      return false
  }
}
