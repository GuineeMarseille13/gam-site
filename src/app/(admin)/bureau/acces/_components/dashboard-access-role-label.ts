import { SYSTEM_ROLES_SEED } from "@/config/system-roles"

export const DASHBOARD_ACCESS_ROLE_LABELS = Object.fromEntries(
  SYSTEM_ROLES_SEED.map((r) => [r.code, r.labelFr]),
) as Record<string, string>

export function getDashboardAccessRoleLabel(code: string): string {
  return DASHBOARD_ACCESS_ROLE_LABELS[code] ?? code
}
