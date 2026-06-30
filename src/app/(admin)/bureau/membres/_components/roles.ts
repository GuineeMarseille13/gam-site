import {
  BUREAU_ACCOUNT_ROLES,
  SYSTEM_ROLES_SEED,
} from "@/config/system-roles"

/** Rôles proposés à la création d’un compte dashboard Bureau. */
export const DASHBOARD_ROLES = BUREAU_ACCOUNT_ROLES.filter(
  (r) => r.code === "SUPER-ADMIN" || r.code === "BUREAU",
).map((r) => ({
  value: r.code,
  label: r.labelFr,
  description: r.description ?? "",
}))

export { SYSTEM_ROLES_SEED }
