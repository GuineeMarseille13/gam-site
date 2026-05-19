import {
  HERBERGEMENT_RELATION_ROLE_CODES,
  PERMANENCE_ADMIN_ROLE_CODES,
} from "@/config/system-roles"
import {
  administrationDestructiveButtonClassName,
  administrationDestructiveGhostClassName,
  administrationGhostButtonClassName,
  administrationOutlineButtonClassName,
  administrationPrimaryButtonClassName,
} from "@/config/administration-dashboard-theme"
import {
  hebergementRelationDestructiveButtonClassName,
  hebergementRelationDestructiveGhostClassName,
  hebergementRelationGhostButtonClassName,
  hebergementRelationOutlineButtonClassName,
  hebergementRelationPrimaryButtonClassName,
} from "@/config/hebergement-relation-dashboard-theme"
import type { DashboardPermissions } from "@/config/dashboard-permissions"
import { requireAdminAcces, requireHerbergementAcces } from "@/lib/auth-guard"
import { createDashboardAccessSchemas } from "@/app/(admin)/_shared/dashboard-access/_schemas/create-dashboard-access-schemas"
import { createDashboardRoleSchemas } from "@/app/(admin)/_shared/dashboard-access/_schemas/create-dashboard-role-schemas"

export type DashboardAccessScopeId = "administration" | "hebergement-relation"

export interface DashboardAccessScope {
  readonly id: DashboardAccessScopeId
  readonly basePath: "/administration" | "/hebergement-relation"
  readonly accesPath: string
  readonly connexionPath: string
  readonly roleCodes: readonly string[]
  readonly defaultRoleCode: string
  readonly labels: {
    readonly accesTitle: string
    readonly accesDescription: string
    readonly nouveauTitle: string
    readonly nouveauDescription: string
    readonly emptyListTitle: string
    readonly emptyListDescription: string
    readonly createCta: string
    readonly listAriaLabel: string
    readonly tableAriaLabel: string
    readonly roleContext: string
  }
  readonly theme: {
    readonly primaryButtonClassName: string
    readonly outlineButtonClassName: string
    readonly ghostButtonClassName: string
    readonly destructiveButtonClassName: string
    readonly destructiveGhostClassName: string
    readonly accent: "sky" | "emerald"
  }
  readonly permissions: {
    readonly canAccessAcces: (permissions: DashboardPermissions) => boolean
    readonly canManageAcces: (permissions: DashboardPermissions) => boolean
  }
  readonly requireAcces: typeof requireAdminAcces
  readonly schemas: ReturnType<typeof createDashboardAccessSchemas>
  readonly roleSchemas: ReturnType<typeof createDashboardRoleSchemas>
}

const administrationRoleSchemas = createDashboardRoleSchemas(PERMANENCE_ADMIN_ROLE_CODES)

export const ADMINISTRATION_ACCESS_SCOPE: DashboardAccessScope = {
  id: "administration",
  basePath: "/administration",
  accesPath: "/administration/acces",
  connexionPath: "/connexion-administration",
  roleCodes: PERMANENCE_ADMIN_ROLE_CODES,
  defaultRoleCode: "PERMADMIN",
  labels: {
    accesTitle: "Accès administration",
    accesDescription:
      "Associez une personne existante à un rôle de permanence administrative et un mot de passe pour le dashboard.",
    nouveauTitle: "Nouvel accès",
    nouveauDescription:
      "Choisissez une personne sans compte, définissez son rôle de permanence administrative et son mot de passe.",
    emptyListTitle: "Aucun accès administration",
    emptyListDescription:
      "Associez une personne existante à un rôle de permanence administrative et un mot de passe.",
    createCta: "Créer un accès",
    listAriaLabel: "Liste des accès administration",
    tableAriaLabel: "Tableau des accès administration",
    roleContext: "permanence administrative",
  },
  theme: {
    primaryButtonClassName: administrationPrimaryButtonClassName,
    outlineButtonClassName: administrationOutlineButtonClassName,
    ghostButtonClassName: administrationGhostButtonClassName,
    destructiveButtonClassName: administrationDestructiveButtonClassName,
    destructiveGhostClassName: administrationDestructiveGhostClassName,
    accent: "sky",
  },
  permissions: {
    canAccessAcces: (p) => p.canAccessAdministrationAcces,
    canManageAcces: (p) => p.canManageAdministrationAcces,
  },
  requireAcces: requireAdminAcces,
  schemas: createDashboardAccessSchemas(administrationRoleSchemas.roleCodeSchema),
  roleSchemas: administrationRoleSchemas,
}

const herbergementRoleSchemas = createDashboardRoleSchemas(HERBERGEMENT_RELATION_ROLE_CODES)

export const HERBERGEMENT_RELATION_ACCESS_SCOPE: DashboardAccessScope = {
  id: "hebergement-relation",
  basePath: "/hebergement-relation",
  accesPath: "/hebergement-relation/acces",
  connexionPath: "/connexion-hebergement-relation",
  roleCodes: HERBERGEMENT_RELATION_ROLE_CODES,
  defaultRoleCode: "HERBERGEMENT-RELATION",
  labels: {
    accesTitle: "Accès hébergement",
    accesDescription:
      "Associez une personne existante à un rôle hébergement et mise en relation et un mot de passe pour le dashboard.",
    nouveauTitle: "Nouvel accès",
    nouveauDescription:
      "Choisissez une personne sans compte, définissez son rôle hébergement et mise en relation et son mot de passe.",
    emptyListTitle: "Aucun accès hébergement",
    emptyListDescription:
      "Associez une personne existante à un rôle hébergement et mise en relation et un mot de passe.",
    createCta: "Créer un accès",
    listAriaLabel: "Liste des accès hébergement",
    tableAriaLabel: "Tableau des accès hébergement",
    roleContext: "hébergement et mise en relation",
  },
  theme: {
    primaryButtonClassName: hebergementRelationPrimaryButtonClassName,
    outlineButtonClassName: hebergementRelationOutlineButtonClassName,
    ghostButtonClassName: hebergementRelationGhostButtonClassName,
    destructiveButtonClassName: hebergementRelationDestructiveButtonClassName,
    destructiveGhostClassName: hebergementRelationDestructiveGhostClassName,
    accent: "emerald",
  },
  permissions: {
    canAccessAcces: (p) => p.canAccessHerbergementAcces,
    canManageAcces: (p) => p.canManageHerbergementAcces,
  },
  requireAcces: requireHerbergementAcces,
  schemas: createDashboardAccessSchemas(herbergementRoleSchemas.roleCodeSchema),
  roleSchemas: herbergementRoleSchemas,
}

const SCOPES: Record<DashboardAccessScopeId, DashboardAccessScope> = {
  administration: ADMINISTRATION_ACCESS_SCOPE,
  "hebergement-relation": HERBERGEMENT_RELATION_ACCESS_SCOPE,
}

export function getDashboardAccessScope(id: DashboardAccessScopeId): DashboardAccessScope {
  return SCOPES[id]
}

export type { DashboardAccessActionResult } from "@/app/(admin)/_shared/dashboard-access/_types/dashboard-access-row"
