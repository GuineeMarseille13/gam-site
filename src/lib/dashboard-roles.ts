/** Accès au dashboard Bureau (routes /bureau) */
export const BUREAU_DASHBOARD_ROLES = ["admin", "bureau"] as const

/**
 * Accès au dashboard Administration (routes /administration).
 * Les rôles admin et bureau y ont le même accès que le rôle dédié « administration ».
 */
export const ADMINISTRATION_DASHBOARD_ROLES = ["admin", "bureau", "administration"] as const

export function isBureauDashboardRole(role: string | null | undefined): boolean {
  return role != null && (BUREAU_DASHBOARD_ROLES as readonly string[]).includes(role)
}

export function isAdministrationDashboardRole(role: string | null | undefined): boolean {
  return role != null && (ADMINISTRATION_DASHBOARD_ROLES as readonly string[]).includes(role)
}
