/**
 * Postes organisationnels (table Poste).
 * Alignés sur `code` unique — utilisés par le seed et l’UI (sélection).
 */
export const ASSOCIATION_POSTES_SEED = [
  { code: "PRESIDENT", labelFr: "Président(e)", sortOrder: 10 },
  { code: "VICE_PRESIDENT", labelFr: "Vice-président(e)", sortOrder: 20 },
  { code: "SECRETARY", labelFr: "Secrétaire", sortOrder: 30 },
  { code: "ASSISTANT_SECRETARY", labelFr: "Secrétaire adjoint(e)", sortOrder: 40 },
  { code: "TREASURER", labelFr: "Trésorier(ère)", sortOrder: 50 },
  { code: "ASSISTANT_TREASURER", labelFr: "Trésorier(ère) adjoint(e)", sortOrder: 60 },
  { code: "VOLUNTEER", labelFr: "Bénévole", sortOrder: 70 },
  { code: "MEMBER", labelFr: "Membre", sortOrder: 80 },
  { code: "AMBASSADOR", labelFr: "Ambassadeur(rice)", sortOrder: 90 },
  { code: "OTHER", labelFr: "Autre", sortOrder: 100 },
] as const

export type AssociationPosteCode = (typeof ASSOCIATION_POSTES_SEED)[number]["code"]
