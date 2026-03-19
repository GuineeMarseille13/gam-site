export const POSTES = [
  { value: "PRESIDENT",           label: "Président(e)" },
  { value: "VICE_PRESIDENT",      label: "Vice-président(e)" },
  { value: "SECRETARY",           label: "Secrétaire" },
  { value: "ASSISTANT_SECRETARY", label: "Secrétaire-adjoint(e)" },
  { value: "TREASURER",           label: "Trésorier(ère)" },
  { value: "ASSISTANT_TREASURER", label: "Trésorier(ère)-adjoint(e)" },
] as const

export type PosteValue = (typeof POSTES)[number]["value"]

export function getPosteLabel(value: string | null | undefined): string {
  return POSTES.find((p) => p.value === value)?.label ?? ""
}
