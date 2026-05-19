import { getDashboardPermissions } from "@/config/dashboard-permissions"

const ADMIN_BASE = "/administration"

const ADMIN_CALENDRIER_PREFIXES = [`${ADMIN_BASE}/calendrier-permanence`] as const

const ADMIN_ACCES_PREFIXES = [
  `${ADMIN_BASE}/acces`,
  `${ADMIN_BASE}/nouveau-compte`,
] as const

const ADMIN_BENEVOLES_PREFIXES = [`${ADMIN_BASE}/benevoles`] as const

const ADMIN_DEMANDE_PREFIXES = [
  `${ADMIN_BASE}/demande-beneficiaire`,
  `${ADMIN_BASE}/suivi-permanence`,
] as const

const ADMIN_CAMPUS_PREFIXES = [`${ADMIN_BASE}/campus-france-depots`] as const

const ADMIN_SUIVI_PREFIXES = [`${ADMIN_BASE}/suivi-demande`] as const

const ADMIN_STATISTIQUES_PREFIXES = [`${ADMIN_BASE}/statistiques`] as const

const ADMIN_PRESENCE_PREFIXES = [`${ADMIN_BASE}/permanence-administrative`] as const

function matchesPrefix(pathname: string, prefixes: readonly string[]): boolean {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}

/**
 * Autorise l’accès à une route `/administration/*` selon le rôle.
 */
export function canAccessAdministrationPath(
  role: string | null | undefined,
  pathname: string,
): boolean {
  const permissions = getDashboardPermissions(role)

  if (!permissions.canAccessAdministrationDashboard) {
    return false
  }

  if (pathname === `${ADMIN_BASE}/profil`) {
    return true
  }

  if (pathname === ADMIN_BASE) {
    return permissions.canAccessAdminOverview
  }

  if (matchesPrefix(pathname, ADMIN_CALENDRIER_PREFIXES)) {
    return permissions.canAccessAdminCalendrier
  }

  if (matchesPrefix(pathname, ADMIN_ACCES_PREFIXES)) {
    return permissions.canAccessAdministrationAcces
  }

  if (matchesPrefix(pathname, ADMIN_BENEVOLES_PREFIXES)) {
    return permissions.canAccessAdminBenevolesList
  }

  if (matchesPrefix(pathname, ADMIN_DEMANDE_PREFIXES)) {
    return permissions.canAccessAdminDemandeBeneficiaire
  }

  if (matchesPrefix(pathname, ADMIN_CAMPUS_PREFIXES)) {
    return permissions.canAccessAdminCampusFrance
  }

  if (matchesPrefix(pathname, ADMIN_SUIVI_PREFIXES)) {
    return permissions.canAccessAdminSuiviDemande
  }

  if (matchesPrefix(pathname, ADMIN_STATISTIQUES_PREFIXES)) {
    return permissions.canAccessAdminStatistiques
  }

  if (matchesPrefix(pathname, ADMIN_PRESENCE_PREFIXES)) {
    return permissions.canAccessAdminPresence
  }

  return permissions.canAccessAdminOverview
}

/** Routes bénévoles réservées à la gestion (création / édition). */
export function canAccessAdministrationBenevolesManagePath(
  role: string | null | undefined,
  pathname: string,
): boolean {
  if (!matchesPrefix(pathname, ADMIN_BENEVOLES_PREFIXES)) {
    return true
  }
  const permissions = getDashboardPermissions(role)
  if (pathname.endsWith("/nouveau") || pathname.includes("/modifier")) {
    return permissions.canManageAdminBenevoles
  }
  return permissions.canAccessAdminBenevolesList
}
