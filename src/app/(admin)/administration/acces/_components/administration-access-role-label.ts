import type { PermanenceAdminRole } from "../_schemas/permanence-admin-role.schema"

export function buildPermanenceAdminRoleLabels(
  roles: PermanenceAdminRole[],
): Record<string, string> {
  return Object.fromEntries(roles.map((role) => [role.code, role.labelFr]))
}

export function getAdministrationAccessRoleLabel(
  code: string,
  roleLabels: Record<string, string>,
): string {
  return roleLabels[code] ?? code
}
