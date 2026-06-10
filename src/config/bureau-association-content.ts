/**
 * Navigation bureau pour le contenu éditable de la page publique « Notre association ».
 */
export const BUREAU_ASSOCIATION_CONTENT_BASE_PATH = "/bureau/notre-association" as const

export type BureauAssociationNavItem = {
  title: string
  url: string
}

export const BUREAU_ASSOCIATION_NAV_ITEMS: readonly BureauAssociationNavItem[] = [
  {
    title: "Le Président",
    url: `${BUREAU_ASSOCIATION_CONTENT_BASE_PATH}/president`,
  },
  {
    title: "Qui sommes-nous ?",
    url: `${BUREAU_ASSOCIATION_CONTENT_BASE_PATH}/qui-sommes-nous`,
  },
  {
    title: "Rapport d'activité",
    url: "/bureau/rapports-activite",
  },
  {
    title: "Notre équipe",
    url: "/bureau/equipe",
  },
] as const

/** Préfixes pour exclure l'état actif des liens voisins dans la sidebar. */
export const BUREAU_ASSOCIATION_ACTIVE_PREFIXES = [
  BUREAU_ASSOCIATION_CONTENT_BASE_PATH,
  "/bureau/rapports-activite",
  "/bureau/equipe",
] as const

export function isBureauAssociationContentPath(pathname: string): boolean {
  return BUREAU_ASSOCIATION_ACTIVE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}
