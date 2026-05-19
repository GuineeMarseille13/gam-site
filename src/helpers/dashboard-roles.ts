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
  "INVITE-PERMADMIN",
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

/** Accès au dashboard Hébergement et mise en relation (routes dédiées, à venir). */
export const HERBERGEMENT_RELATION_DASHBOARD_ROLES = [
  "SUPER-ADMIN",
  "ADMIN-HERBERGEMENT-RELATION",
  "HERBERGEMENT-RELATION",
  "INVITE-HERBERGEMENT-RELATION",
] as const satisfies readonly SystemRoleCode[]

export function isHerbergementRelationDashboardRole(
  role: string | null | undefined,
): boolean {
  return (
    role != null &&
    (HERBERGEMENT_RELATION_DASHBOARD_ROLES as readonly string[]).includes(role)
  )
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

/** Compte limité au pôle Hébergement et mise en relation (sans Bureau ni Administration). */
export function isHerbergementRelationOnlyRole(role: string | null | undefined): boolean {
  if (!role) return false
  return (
    role === "ADMIN-HERBERGEMENT-RELATION" ||
    role === "HERBERGEMENT-RELATION" ||
    role === "INVITE-HERBERGEMENT-RELATION"
  )
}
