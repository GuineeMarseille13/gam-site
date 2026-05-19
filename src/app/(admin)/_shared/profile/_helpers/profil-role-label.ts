import { SYSTEM_ROLES_SEED } from "@/config/system-roles"

const ROLE_LABEL_BY_CODE = Object.fromEntries(
  SYSTEM_ROLES_SEED.map((role) => [role.code, role.labelFr]),
) as Record<string, string>

/**
 * Libellé affiché du rôle Better Auth (`User.role`) sur « Mon profil ».
 */
export function getProfilRoleLabel(role: string | null | undefined): string | null {
  if (!role?.trim()) return null
  return ROLE_LABEL_BY_CODE[role] ?? role
}
