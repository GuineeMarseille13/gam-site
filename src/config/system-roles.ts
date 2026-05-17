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
    description: "Administration permanence — droits étendus",
    sortOrder: 40,
  },
  {
    code: "PERMADMIN",
    labelFr: "Utilisateur Permanence administrative",
    description: "Dashboard Administration",
    sortOrder: 50,
  },
  {
    code: "INVITE-PERMADMIN",
    labelFr: "Invité permanence administrative",
    description: "Accès limité au dashboard Administration",
    sortOrder: 60,
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
