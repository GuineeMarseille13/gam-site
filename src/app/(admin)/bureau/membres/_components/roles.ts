/** Tous les rôles (utilisé pour les filtres et badges) */
export const ROLES = [
  { value: "admin",    label: "Administrateur", description: "Accès complet au dashboard" },
  { value: "bureau",   label: "Bureau",         description: "Membre du bureau" },
  { value: "benevole", label: "Bénévole",       description: "Bénévole de l'association" },
] as const

/** Rôles autorisés à accéder au dashboard (formulaire compte d'accès) */
export const DASHBOARD_ROLES = [
  { value: "admin",  label: "Administrateur", description: "Accès complet au dashboard" },
  { value: "bureau", label: "Bureau",         description: "Membre du bureau" },
] as const
