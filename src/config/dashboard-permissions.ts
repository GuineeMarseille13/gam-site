import type { SystemRoleCode } from "@/config/system-roles"

/**
 * Capacités fonctionnelles des dashboards (source de vérité métier).
 * Ne pas confondre avec les codes rôles Better Auth (`User.role`).
 */
export const DASHBOARD_CAPABILITY = {
  bureauOverview: "bureau.overview",
  bureauContenu: "bureau.contenu",
  bureauPaiements: "bureau.paiements",
  bureauAdminMembres: "bureau.admin.membres",
  bureauAdminAdherents: "bureau.admin.adherents",
  bureauAdminBenevoles: "bureau.admin.benevoles",
  bureauAdminEquipe: "bureau.admin.equipe",
  bureauAdminAcces: "bureau.admin.acces",
  bureauAdminDelete: "bureau.admin.delete",
  bureauManageAccessAccounts: "bureau.admin.manage-access",
  bureauManageUserRoles: "bureau.admin.manage-roles",
  bureauBanUsers: "bureau.admin.ban-users",
  crossAdministrationDashboard: "cross.administration-dashboard",
} as const

export type DashboardCapability =
  (typeof DASHBOARD_CAPABILITY)[keyof typeof DASHBOARD_CAPABILITY]

export interface DashboardPermissions {
  readonly canAccessBureauDashboard: boolean
  readonly canAccessAdministrationDashboard: boolean
  readonly canAccessOverview: boolean
  readonly canAccessContenu: boolean
  readonly canAccessPaiements: boolean
  readonly canAccessAdminMembres: boolean
  readonly canAccessAdminAdherents: boolean
  readonly canAccessAdminBenevoles: boolean
  readonly canAccessAdminEquipe: boolean
  readonly canAccessAdminAcces: boolean
  readonly canDeleteAdminEntities: boolean
  readonly canManageAccessAccounts: boolean
  readonly canManageUserRoles: boolean
  readonly canBanUsers: boolean
}

const ALL_BUREAU_CAPABILITIES: DashboardCapability[] = [
  DASHBOARD_CAPABILITY.bureauOverview,
  DASHBOARD_CAPABILITY.bureauContenu,
  DASHBOARD_CAPABILITY.bureauPaiements,
  DASHBOARD_CAPABILITY.bureauAdminMembres,
  DASHBOARD_CAPABILITY.bureauAdminAdherents,
  DASHBOARD_CAPABILITY.bureauAdminBenevoles,
  DASHBOARD_CAPABILITY.bureauAdminEquipe,
  DASHBOARD_CAPABILITY.bureauAdminAcces,
  DASHBOARD_CAPABILITY.bureauAdminDelete,
  DASHBOARD_CAPABILITY.bureauManageAccessAccounts,
  DASHBOARD_CAPABILITY.bureauManageUserRoles,
  DASHBOARD_CAPABILITY.bureauBanUsers,
  DASHBOARD_CAPABILITY.crossAdministrationDashboard,
]

function buildPermissions(
  capabilities: readonly DashboardCapability[],
): DashboardPermissions {
  const set = new Set(capabilities)
  return {
    canAccessBureauDashboard:
      set.has(DASHBOARD_CAPABILITY.bureauOverview) ||
      set.has(DASHBOARD_CAPABILITY.bureauContenu) ||
      set.has(DASHBOARD_CAPABILITY.bureauAdminMembres),
    canAccessAdministrationDashboard: set.has(
      DASHBOARD_CAPABILITY.crossAdministrationDashboard,
    ),
    canAccessOverview: set.has(DASHBOARD_CAPABILITY.bureauOverview),
    canAccessContenu: set.has(DASHBOARD_CAPABILITY.bureauContenu),
    canAccessPaiements: set.has(DASHBOARD_CAPABILITY.bureauPaiements),
    canAccessAdminMembres: set.has(DASHBOARD_CAPABILITY.bureauAdminMembres),
    canAccessAdminAdherents: set.has(DASHBOARD_CAPABILITY.bureauAdminAdherents),
    canAccessAdminBenevoles: set.has(DASHBOARD_CAPABILITY.bureauAdminBenevoles),
    canAccessAdminEquipe: set.has(DASHBOARD_CAPABILITY.bureauAdminEquipe),
    canAccessAdminAcces: set.has(DASHBOARD_CAPABILITY.bureauAdminAcces),
    canDeleteAdminEntities: set.has(DASHBOARD_CAPABILITY.bureauAdminDelete),
    canManageAccessAccounts: set.has(DASHBOARD_CAPABILITY.bureauManageAccessAccounts),
    canManageUserRoles: set.has(DASHBOARD_CAPABILITY.bureauManageUserRoles),
    canBanUsers: set.has(DASHBOARD_CAPABILITY.bureauBanUsers),
  }
}

const ROLE_CAPABILITIES: Record<SystemRoleCode, readonly DashboardCapability[]> = {
  "SUPER-ADMIN": ALL_BUREAU_CAPABILITIES,
  BUREAU: [
    DASHBOARD_CAPABILITY.bureauOverview,
    DASHBOARD_CAPABILITY.bureauContenu,
    DASHBOARD_CAPABILITY.bureauPaiements,
    DASHBOARD_CAPABILITY.bureauAdminMembres,
    DASHBOARD_CAPABILITY.bureauAdminAdherents,
    DASHBOARD_CAPABILITY.bureauAdminBenevoles,
    DASHBOARD_CAPABILITY.crossAdministrationDashboard,
  ],
  "INVITE-BUREAU": [
    DASHBOARD_CAPABILITY.bureauOverview,
    DASHBOARD_CAPABILITY.bureauContenu,
    DASHBOARD_CAPABILITY.bureauAdminMembres,
  ],
  "ADMIN-PERMADMIN": [DASHBOARD_CAPABILITY.crossAdministrationDashboard],
  PERMADMIN: [DASHBOARD_CAPABILITY.crossAdministrationDashboard],
  "INVITE-PERMADMIN": [DASHBOARD_CAPABILITY.crossAdministrationDashboard],
}

const EMPTY_PERMISSIONS = buildPermissions([])

/** Matrice rôle → capacités (SUPER-ADMIN, BUREAU, INVITE-BUREAU, …). */
export function getDashboardPermissions(
  role: string | null | undefined,
): DashboardPermissions {
  if (!role || !(role in ROLE_CAPABILITIES)) {
    return EMPTY_PERMISSIONS
  }
  return buildPermissions(ROLE_CAPABILITIES[role as SystemRoleCode])
}

export function hasDashboardCapability(
  role: string | null | undefined,
  capability: DashboardCapability,
): boolean {
  if (!role || !(role in ROLE_CAPABILITIES)) return false
  return ROLE_CAPABILITIES[role as SystemRoleCode].includes(capability)
}
