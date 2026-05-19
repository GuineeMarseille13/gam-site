/**
 * Rôles d’accès dashboard (table Role, champ Better Auth `User.role`).
 */
export const SYSTEM_ROLES_SEED = [
  {
    code: "SUPER-ADMIN",
    labelFr: "Super administrateur",
    description: "Accès complet à tous les dashboards et fonctionnalités",
    sortOrder: 10,
  },
  {
    code: "BUREAU",
    labelFr: "Bureau",
    description: "Bureau : contenu, paiements, membres (sans suppression) et accès au dashboard Administration",
    sortOrder: 20,
  },
  {
    code: "INVITE-BUREAU",
    labelFr: "Invité bureau",
    description: "Bureau : contenu et liste des membres uniquement",
    sortOrder: 30,
  },
  {
    code: "ADMIN-PERMADMIN",
    labelFr: "Admin permanence administrative",
    description: "Administration — accès complet (hors autres dashboards)",
    sortOrder: 40,
  },
  {
    code: "PERMADMIN",
    labelFr: "Utilisateur Permanence administrative",
    description: "Administration — sans accès, calendrier ni suppression bénévole",
    sortOrder: 50,
  },
  {
    code: "INVITE-PERMADMIN",
    labelFr: "Invité permanence administrative",
    description: "Administration — consultation bénévoles uniquement (liste)",
    sortOrder: 60,
  },
  {
    code: "ADMIN-HERBERGEMENT-RELATION",
    labelFr: "Admin hébergement et mise en relation",
    description: "Hébergement et mise en relation — accès complet (hors autres dashboards)",
    sortOrder: 70,
  },
  {
    code: "HERBERGEMENT-RELATION",
    labelFr: "Utilisateur hébergement et mise en relation",
    description: "Hébergement et mise en relation — sans gestion des accès",
    sortOrder: 80,
  },
  {
    code: "INVITE-HERBERGEMENT-RELATION",
    labelFr: "Invité hébergement et mise en relation",
    description: "Hébergement et mise en relation — consultation uniquement",
    sortOrder: 90,
  },
] as const

export type SystemRoleCode = (typeof SYSTEM_ROLES_SEED)[number]["code"]

const BUREAU_ACCOUNT_ROLE_CODES = ["SUPER-ADMIN", "BUREAU", "INVITE-BUREAU"] as const

/** Rôles liés au périmètre Bureau (filtres, badges). */
export const BUREAU_ACCOUNT_ROLES = SYSTEM_ROLES_SEED.filter((r) =>
  (BUREAU_ACCOUNT_ROLE_CODES as readonly string[]).includes(r.code),
)

/** Tous les rôles d’accès (filtres, badges comptes). */
export const ALL_ACCOUNT_ROLES = SYSTEM_ROLES_SEED

const PERMANENCE_ADMIN_ROLE_CODES = [
  "ADMIN-PERMADMIN",
  "PERMADMIN",
  "INVITE-PERMADMIN",
] as const

export type PermanenceAdminRoleCode = (typeof PERMANENCE_ADMIN_ROLE_CODES)[number]

/** Rôles du dashboard Administration (permanence). */
export const PERMANENCE_ADMIN_ACCOUNT_ROLES = SYSTEM_ROLES_SEED.filter((r) =>
  (PERMANENCE_ADMIN_ROLE_CODES as readonly string[]).includes(r.code),
)

export { PERMANENCE_ADMIN_ROLE_CODES }

const HERBERGEMENT_RELATION_ROLE_CODES = [
  "ADMIN-HERBERGEMENT-RELATION",
  "HERBERGEMENT-RELATION",
  "INVITE-HERBERGEMENT-RELATION",
] as const

export type HerbergementRelationRoleCode =
  (typeof HERBERGEMENT_RELATION_ROLE_CODES)[number]

/** Rôles du pôle Hébergement et mise en relation (dashboard dédié). */
export const HERBERGEMENT_RELATION_ACCOUNT_ROLES = SYSTEM_ROLES_SEED.filter((r) =>
  (HERBERGEMENT_RELATION_ROLE_CODES as readonly string[]).includes(r.code),
)

export { HERBERGEMENT_RELATION_ROLE_CODES }
