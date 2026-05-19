import type { z } from "zod"
import type { DashboardAccessScope } from "@/config/dashboard-access-scope"

export function buildDashboardAccessRoleLabels(
  roles: z.infer<DashboardAccessScope["roleSchemas"]["roleSchema"]>[],
): Record<string, string> {
  return Object.fromEntries(roles.map((role) => [role.code, role.labelFr]))
}

export function getDashboardAccessRoleLabel(
  code: string,
  roleLabels: Record<string, string>,
): string {
  return roleLabels[code] ?? code
}
