import {
  DASHBOARD_CAPABILITY,
  getDashboardPermissions,
  hasDashboardCapability,
} from "@/config/dashboard-permissions"

const BUREAU_PAIEMENTS_PREFIXES = [
  "/bureau/adhesions",
  "/bureau/dons",
  "/bureau/commandes",
] as const

const BUREAU_ADMIN_ADHERENTS_PREFIXES = ["/bureau/adherents"] as const

const BUREAU_ADMIN_BENEVOLES_PREFIXES = ["/bureau/benevoles"] as const

const BUREAU_ADMIN_EQUIPE_PREFIXES = ["/bureau/equipe"] as const

const BUREAU_ADMIN_ACCES_PREFIXES = ["/bureau/acces"] as const

const BUREAU_ADMIN_MEMBRES_PREFIXES = ["/bureau/membres", "/bureau/aide"] as const

/** Préfixes « Contenu du site » (hors vue d’ensemble et zones admin / paiements). */
const BUREAU_CONTENU_PREFIXES = [
  "/bureau/popup",
  "/bureau/bandeau",
  "/bureau/carousel",
  "/bureau/evenements",
  "/bureau/poles",
  "/bureau/rapports-activite",
  "/bureau/partenaires",
  "/bureau/produits",
  "/bureau/temoignages-video",
  "/bureau/avis",
  "/bureau/statistiques",
  "/bureau/contact",
] as const

function matchesPrefix(pathname: string, prefixes: readonly string[]): boolean {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}

/**
 * Autorise l’accès à une route `/bureau/*` selon le rôle.
 * La vue d’ensemble `/bureau` est toujours accessible si le dashboard Bureau l’est.
 */
export function canAccessBureauPath(
  role: string | null | undefined,
  pathname: string,
): boolean {
  const permissions = getDashboardPermissions(role)

  if (!permissions.canAccessBureauDashboard) {
    return false
  }

  if (pathname === "/bureau" || pathname === "/bureau/profil") {
    return permissions.canAccessOverview || permissions.canAccessContenu
  }

  if (matchesPrefix(pathname, BUREAU_PAIEMENTS_PREFIXES)) {
    return permissions.canAccessPaiements
  }

  if (matchesPrefix(pathname, BUREAU_ADMIN_MEMBRES_PREFIXES)) {
    return permissions.canAccessAdminMembres
  }

  if (matchesPrefix(pathname, BUREAU_ADMIN_ADHERENTS_PREFIXES)) {
    return permissions.canAccessAdminAdherents
  }

  if (matchesPrefix(pathname, BUREAU_ADMIN_BENEVOLES_PREFIXES)) {
    return permissions.canAccessAdminBenevoles
  }

  if (matchesPrefix(pathname, BUREAU_ADMIN_EQUIPE_PREFIXES)) {
    return permissions.canAccessAdminEquipe
  }

  if (matchesPrefix(pathname, BUREAU_ADMIN_ACCES_PREFIXES)) {
    return permissions.canAccessAdminAcces
  }

  if (matchesPrefix(pathname, BUREAU_CONTENU_PREFIXES)) {
    return permissions.canAccessContenu
  }

  return permissions.canAccessOverview
}

/** Vérifie une capacité métier à partir du rôle session. */
export function roleHasBureauCapability(
  role: string | null | undefined,
  capability: (typeof DASHBOARD_CAPABILITY)[keyof typeof DASHBOARD_CAPABILITY],
): boolean {
  return hasDashboardCapability(role, capability)
}
