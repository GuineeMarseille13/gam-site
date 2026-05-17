import { ASSOCIATION_POSTES_SEED } from "@/config/association-postes"

const BUREAU_CODES = new Set([
  "PRESIDENT",
  "VICE_PRESIDENT",
  "SECRETARY",
  "ASSISTANT_SECRETARY",
  "TREASURER",
  "ASSISTANT_TREASURER",
])

/** Postes affichés dans les formulaires bureau / équipe (hors bénévole seul). */
export const POSTES = ASSOCIATION_POSTES_SEED.filter((r) => BUREAU_CODES.has(r.code)).map(
  (r) => ({
    value: r.code,
    label: r.labelFr,
  }),
)

/** Libellé français d’un poste par code. */
export function getPosteLabel(code: string): string {
  return ASSOCIATION_POSTES_SEED.find((r) => r.code === code)?.labelFr ?? ""
}
