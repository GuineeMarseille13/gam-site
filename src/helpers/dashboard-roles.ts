import type { SystemRoleCode } from "@/config/system-roles"

/** Accès au dashboard Bureau (routes /bureau) */
export const BUREAU_DASHBOARD_ROLES = [
  "SUPER-ADMIN",
  "BUREAU",
  "INVITE-BUREAU",
] as const satisfies readonly SystemRoleCode[]

/**
 * Accès au dashboard Administration (routes /administration).
 * SUPER-ADMIN et BUREAU conservent l’accès croisé historique.
 */
export const ADMINISTRATION_DASHBOARD_ROLES = [
  "SUPER-ADMIN",
  "BUREAU",
  "ADMIN-PERMADMIN",
  "PERMADMIN",
] as const satisfies readonly SystemRoleCode[]

/** Rôle super administrateur (actions réservées). */
export const SUPER_ADMIN_ROLE = "SUPER-ADMIN" as const satisfies SystemRoleCode

export function isBureauDashboardRole(role: string | null | undefined): boolean {
  return role != null && (BUREAU_DASHBOARD_ROLES as readonly string[]).includes(role)
}

export function isAdministrationDashboardRole(role: string | null | undefined): boolean {
  return role != null && (ADMINISTRATION_DASHBOARD_ROLES as readonly string[]).includes(role)
}

export function isSuperAdminRole(role: string | null | undefined): boolean {
  return role === SUPER_ADMIN_ROLE
}

/** Redirection vers /administration si le compte n’a que l’espace permanence. */
export function isPermanenceOnlyRole(role: string | null | undefined): boolean {
  if (!role) return false
  return (
    role === "ADMIN-PERMADMIN" ||
    role === "PERMADMIN" ||
    role === "INVITE-PERMADMIN"
  )
}
