import { getDashboardPermissions } from "@/config/dashboard-permissions"

const BASE = "/hebergement-relation"

const ACCES_PREFIXES = [`${BASE}/acces`] as const

function matchesPrefix(pathname: string, prefixes: readonly string[]): boolean {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}

/**
 * Autorise l’accès à une route `/hebergement-relation/*` selon le rôle.
 */
export function canAccessHerbergementRelationPath(
  role: string | null | undefined,
  pathname: string,
): boolean {
  const permissions = getDashboardPermissions(role)

  if (!permissions.canAccessHerbergementRelationDashboard) {
    return false
  }

  if (pathname === `${BASE}/profil`) {
    return true
  }

  if (pathname === BASE) {
    return permissions.canAccessHerbergementOverview
  }

  if (matchesPrefix(pathname, ACCES_PREFIXES)) {
    return permissions.canAccessHerbergementAcces
  }

  return permissions.canAccessHerbergementOverview
}
