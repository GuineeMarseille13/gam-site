import {
  ALL_ACCOUNT_ROLES,
  BUREAU_ACCOUNT_ROLES,
  SYSTEM_ROLES_SEED,
} from "@/config/system-roles"

/** Tous les rôles d’accès (filtres et badges) + filtre section bénévoles. */
export const ROLES = [
  ...ALL_ACCOUNT_ROLES.map((r) => ({
    value: r.code,
    label: r.labelFr,
    description: r.description ?? "",
  })),
  {
    value: "benevoles",
    label: "Bénévoles",
    description: "Contacts bénévoles (sans compte dashboard)",
  },
]

/** Rôles proposés à la création d’un compte dashboard Bureau. */
export const DASHBOARD_ROLES = BUREAU_ACCOUNT_ROLES.filter(
  (r) => r.code === "SUPER-ADMIN" || r.code === "BUREAU",
).map((r) => ({
  value: r.code,
  label: r.labelFr,
  description: r.description ?? "",
}))

export { SYSTEM_ROLES_SEED }
