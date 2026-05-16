/**
 * Pôles dont le contenu « page publique » est éditable sous `/bureau/poles/{slug}/…`
 * (accordéons dans la sidebar « Contenu du site »).
 */
export const BUREAU_POLE_CONTENT_SLUGS = [
  "demarche-administrative",
  "evenementiel",
  "mise-en-relation",
] as const

export type BureauPoleContentSlug = (typeof BUREAU_POLE_CONTENT_SLUGS)[number]

export type BureauPoleContentEntry = {
  slug: BureauPoleContentSlug
  /** Libellé de l’accordéon (sidebar). */
  accordionLabel: string
  /** Titre court pour métadonnées / pages bureau. */
  metaTitle: string
}

export const BUREAU_POLE_CONTENT_ENTRIES: readonly BureauPoleContentEntry[] = [
  {
    slug: "demarche-administrative",
    accordionLabel: "Accompagnement administratif",
    metaTitle: "Accompagnement administratif",
  },
  {
    slug: "evenementiel",
    accordionLabel: "Événementiel",
    metaTitle: "Événementiel",
  },
  {
    slug: "mise-en-relation",
    accordionLabel: "Hébergement et Mise en relation",
    metaTitle: "Hébergement et Mise en relation",
  },
]

export const BUREAU_POLE_CONTENT_SLUG_SET = new Set<string>(BUREAU_POLE_CONTENT_SLUGS)

export function isBureauPoleContentSlug(
  value: string,
): value is BureauPoleContentSlug {
  return BUREAU_POLE_CONTENT_SLUG_SET.has(value)
}

export function getBureauPoleContentEntry(
  slug: BureauPoleContentSlug,
): BureauPoleContentEntry {
  const entry = BUREAU_POLE_CONTENT_ENTRIES.find((e) => e.slug === slug)
  if (!entry) {
    throw new Error(`Pôle bureau inconnu: ${slug}`)
  }
  return entry
}

export function buildBureauPoleSectionPaths(slug: BureauPoleContentSlug) {
  const base = `/bureau/poles/${slug}` as const
  return {
    base,
    titre: `${base}/titre`,
    nosServices: `${base}/nos-services`,
    statistiques: `${base}/statistiques`,
    nosRealisations: `${base}/nos-realisations`,
  }
}

export function buildBureauPoleSectionNavItems(slug: BureauPoleContentSlug) {
  const p = buildBureauPoleSectionPaths(slug)
  return [
    { title: "À propos", url: p.titre },
    { title: "Nos services", url: p.nosServices },
    { title: "Statistiques", url: p.statistiques },
    { title: "Nos réalisations", url: p.nosRealisations },
  ] as const
}

/** Préfixes `/bureau/poles/{slug}` pour exclure l’état actif du lien « Pôles ». */
export const BUREAU_POLE_CONTENT_BASE_PATHS = BUREAU_POLE_CONTENT_SLUGS.map(
  (slug) => `/bureau/poles/${slug}`,
)
