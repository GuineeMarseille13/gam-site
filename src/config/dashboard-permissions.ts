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
  crossBureauDashboard: "cross.bureau-dashboard",
  crossAdministrationDashboard: "cross.administration-dashboard",
  adminOverview: "admin.overview",
  adminPresence: "admin.presence",
  adminCalendrier: "admin.calendrier",
  adminDemandeBeneficiaire: "admin.demande-beneficiaire",
  adminCampusFrance: "admin.campus-france",
  adminSuiviDemande: "admin.suivi-demande",
  adminBenevolesRead: "admin.benevoles.read",
  adminBenevolesManage: "admin.benevoles.manage",
  adminBenevolesDelete: "admin.benevoles.delete",
  adminStatistiques: "admin.statistiques",
  adminAcces: "admin.acces",
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
  readonly canAccessAdminOverview: boolean
  readonly canAccessAdminPresence: boolean
  readonly canAccessAdminCalendrier: boolean
  readonly canAccessAdminDemandeBeneficiaire: boolean
  readonly canAccessAdminCampusFrance: boolean
  readonly canAccessAdminSuiviDemande: boolean
  readonly canAccessAdminBenevolesList: boolean
  readonly canManageAdminBenevoles: boolean
  readonly canDeleteAdminBenevole: boolean
  readonly canAccessAdminStatistiques: boolean
  readonly canAccessAdministrationAcces: boolean
  readonly canManageAdministrationAcces: boolean
  readonly canAccessBureauDashboardCross: boolean
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

const ALL_ADMIN_CAPABILITIES: DashboardCapability[] = [
  DASHBOARD_CAPABILITY.adminOverview,
  DASHBOARD_CAPABILITY.adminPresence,
  DASHBOARD_CAPABILITY.adminCalendrier,
  DASHBOARD_CAPABILITY.adminDemandeBeneficiaire,
  DASHBOARD_CAPABILITY.adminCampusFrance,
  DASHBOARD_CAPABILITY.adminSuiviDemande,
  DASHBOARD_CAPABILITY.adminBenevolesRead,
  DASHBOARD_CAPABILITY.adminBenevolesManage,
  DASHBOARD_CAPABILITY.adminBenevolesDelete,
  DASHBOARD_CAPABILITY.adminStatistiques,
  DASHBOARD_CAPABILITY.adminAcces,
]

const PERMADMIN_ADMIN_CAPABILITIES: DashboardCapability[] = ALL_ADMIN_CAPABILITIES.filter(
  (c) =>
    c !== DASHBOARD_CAPABILITY.adminAcces &&
    c !== DASHBOARD_CAPABILITY.adminCalendrier &&
    c !== DASHBOARD_CAPABILITY.adminBenevolesDelete,
)

const INVITE_PERMADMIN_ADMIN_CAPABILITIES: DashboardCapability[] =
  PERMADMIN_ADMIN_CAPABILITIES.filter(
    (c) => c !== DASHBOARD_CAPABILITY.adminBenevolesManage,
  )

function buildPermissions(
  capabilities: readonly DashboardCapability[],
): DashboardPermissions {
  const set = new Set(capabilities)
  const hasAdminFeature =
    set.has(DASHBOARD_CAPABILITY.adminOverview) ||
    set.has(DASHBOARD_CAPABILITY.crossAdministrationDashboard)

  return {
    canAccessBureauDashboard:
      set.has(DASHBOARD_CAPABILITY.crossBureauDashboard) ||
      set.has(DASHBOARD_CAPABILITY.bureauOverview) ||
      set.has(DASHBOARD_CAPABILITY.bureauContenu) ||
      set.has(DASHBOARD_CAPABILITY.bureauAdminMembres),
    canAccessAdministrationDashboard:
      hasAdminFeature || set.has(DASHBOARD_CAPABILITY.crossAdministrationDashboard),
    canAccessOverview: set.has(DASHBOARD_CAPABILITY.bureauOverview),
    canAccessContenu: set.has(DASHBOARD_CAPABILITY.bureauContenu),
    canAccessPaiements: set.has(DASHBOARD_CAPABILITY.bureauPaiements),
    canAccessAdminMembres: set.has(DASHBOARD_CAPABILITY.bureauAdminMembres),
    canAccessAdminAdherents: set.has(DASHBOARD_CAPABILITY.bureauAdminAdherents),
    canAccessAdminBenevoles:
      set.has(DASHBOARD_CAPABILITY.bureauAdminBenevoles) ||
      set.has(DASHBOARD_CAPABILITY.adminBenevolesManage),
    canAccessAdminEquipe: set.has(DASHBOARD_CAPABILITY.bureauAdminEquipe),
    canAccessAdminAcces: set.has(DASHBOARD_CAPABILITY.bureauAdminAcces),
    canDeleteAdminEntities: set.has(DASHBOARD_CAPABILITY.bureauAdminDelete),
    canManageAccessAccounts: set.has(DASHBOARD_CAPABILITY.bureauManageAccessAccounts),
    canManageUserRoles: set.has(DASHBOARD_CAPABILITY.bureauManageUserRoles),
    canBanUsers: set.has(DASHBOARD_CAPABILITY.bureauBanUsers),
    canAccessAdminOverview: set.has(DASHBOARD_CAPABILITY.adminOverview),
    canAccessAdminPresence: set.has(DASHBOARD_CAPABILITY.adminPresence),
    canAccessAdminCalendrier: set.has(DASHBOARD_CAPABILITY.adminCalendrier),
    canAccessAdminDemandeBeneficiaire: set.has(
      DASHBOARD_CAPABILITY.adminDemandeBeneficiaire,
    ),
    canAccessAdminCampusFrance: set.has(DASHBOARD_CAPABILITY.adminCampusFrance),
    canAccessAdminSuiviDemande: set.has(DASHBOARD_CAPABILITY.adminSuiviDemande),
    canAccessAdminBenevolesList: set.has(DASHBOARD_CAPABILITY.adminBenevolesRead),
    canManageAdminBenevoles: set.has(DASHBOARD_CAPABILITY.adminBenevolesManage),
    canDeleteAdminBenevole: set.has(DASHBOARD_CAPABILITY.adminBenevolesDelete),
    canAccessAdminStatistiques: set.has(DASHBOARD_CAPABILITY.adminStatistiques),
    canAccessAdministrationAcces: set.has(DASHBOARD_CAPABILITY.adminAcces),
    canManageAdministrationAcces: set.has(DASHBOARD_CAPABILITY.adminAcces),
    canAccessBureauDashboardCross: set.has(DASHBOARD_CAPABILITY.crossBureauDashboard),
  }
}

const ROLE_CAPABILITIES: Record<SystemRoleCode, readonly DashboardCapability[]> = {
  "SUPER-ADMIN": [
    ...ALL_BUREAU_CAPABILITIES,
    ...ALL_ADMIN_CAPABILITIES,
    DASHBOARD_CAPABILITY.crossBureauDashboard,
  ],
  BUREAU: [
    DASHBOARD_CAPABILITY.bureauOverview,
    DASHBOARD_CAPABILITY.bureauContenu,
    DASHBOARD_CAPABILITY.bureauPaiements,
    DASHBOARD_CAPABILITY.bureauAdminMembres,
    DASHBOARD_CAPABILITY.bureauAdminAdherents,
    DASHBOARD_CAPABILITY.bureauAdminBenevoles,
    DASHBOARD_CAPABILITY.crossAdministrationDashboard,
    DASHBOARD_CAPABILITY.crossBureauDashboard,
    ...ALL_ADMIN_CAPABILITIES,
  ],
  "INVITE-BUREAU": [
    DASHBOARD_CAPABILITY.bureauOverview,
    DASHBOARD_CAPABILITY.bureauContenu,
    DASHBOARD_CAPABILITY.bureauAdminMembres,
  ],
  "ADMIN-PERMADMIN": [...ALL_ADMIN_CAPABILITIES],
  PERMADMIN: [...PERMADMIN_ADMIN_CAPABILITIES],
  "INVITE-PERMADMIN": [...INVITE_PERMADMIN_ADMIN_CAPABILITIES],
}

const EMPTY_PERMISSIONS = buildPermissions([])

/** Matrice rôle → capacités (tous dashboards). */
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
