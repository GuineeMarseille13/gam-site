import { ALL_ACCOUNT_ROLES } from "@/config/system-roles"

export const MEMBRES_STATUT_FILTERS = [
  { value: "actif", label: "Actif" },
  { value: "banni", label: "Banni" },
] as const

/** Filtres de section (pas un rôle Better Auth). */
export const MEMBRES_SECTION_FILTERS = [
  { value: "benevoles", label: "Bénévoles", permission: "benevoles" as const },
  { value: "BUREAU", label: "Membres du bureau", permission: "equipe" as const },
] as const

/** Filtres par rôle de compte dashboard. */
export const MEMBRES_ACCOUNT_ROLE_FILTERS = ALL_ACCOUNT_ROLES.map((role) => ({
  value: role.code,
  label: role.labelFr,
}))

export const MEMBRES_SPECIAL_ROLE_FILTERS = new Set([
  "",
  "SUPER-ADMIN",
  "ADMIN-PERMADMIN",
  "BUREAU",
  "benevoles",
])

export function isMembresSectionFilter(role: string): boolean {
  return role === "benevoles" || role === "BUREAU"
}

export function isMembresGenericAccountRoleFilter(role: string | undefined): role is string {
  if (!role) return false
  if (MEMBRES_SPECIAL_ROLE_FILTERS.has(role)) return false
  return MEMBRES_ACCOUNT_ROLE_FILTERS.some((item) => item.value === role)
}

export function getMembresAccountRoleLabel(role: string): string | null {
  return MEMBRES_ACCOUNT_ROLE_FILTERS.find((item) => item.value === role)?.label ?? null
}
