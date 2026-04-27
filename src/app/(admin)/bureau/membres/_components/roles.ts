/** Tous les rôles (utilisé pour les filtres et badges) */
export const ROLES = [
  { value: "admin",           label: "Administrateur", description: "Accès complet au dashboard" },
  { value: "bureau",          label: "Bureau",         description: "Membres du bureau (équipe)" },
  { value: "administration",  label: "Administration", description: "Accès au dashboard Administration (/administration)" },
  { value: "benevole",        label: "Bénévole",       description: "Bénévole de l'association" },
] as const

/** Rôles proposés à la création d'un compte dashboard (Bureau) — le rôle « administration » se configure côté base ou outil admin */
export const DASHBOARD_ROLES = [
  { value: "admin",  label: "Administrateur", description: "Accès complet au dashboard Bureau" },
  { value: "bureau", label: "Bureau",         description: "Membre du bureau" },
] as const
