import { ASSOCIATION_ROLES_SEED } from "@/config/association-roles"

/** Postes du bureau uniquement (sous-ensemble des codes Role). */
const BUREAU_CODES = new Set([
  "PRESIDENT",
  "VICE_PRESIDENT",
  "SECRETARY",
  "ASSISTANT_SECRETARY",
  "TREASURER",
  "ASSISTANT_TREASURER",
])

export const POSTES = ASSOCIATION_ROLES_SEED.filter((r) => BUREAU_CODES.has(r.code)).map(
  (r) => ({ value: r.code, label: r.labelFr }),
)

export type PosteValue = (typeof POSTES)[number]["value"]

/** Libellé pour un code de poste bureau (liste POSTES). */
export function getPosteLabel(value: string | null | undefined): string {
  return POSTES.find((p) => p.value === value)?.label ?? ""
}

/** Libellé FR à partir du code Role (toute la table, ex. MEMBER, VOLUNTEER). */
export function getAssociationRoleLabelByCode(code: string | null | undefined): string {
  if (!code) return ""
  return ASSOCIATION_ROLES_SEED.find((r) => r.code === code)?.labelFr ?? ""
}
