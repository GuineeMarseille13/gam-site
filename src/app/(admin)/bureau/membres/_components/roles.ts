/** Tous les rôles (utilisé pour les filtres et badges) */
export const ROLES = [
  { value: "admin",           label: "Administrateur", description: "Accès complet au dashboard" },
  { value: "bureau",          label: "Bureau",         description: "Membre du bureau" },
  { value: "administration",  label: "Administration", description: "Dashboard administration (bénévoles, profil)" },
  { value: "benevole",        label: "Bénévole",       description: "Bénévole de l'association" },
] as const

/** Rôles proposés à la création d'un compte dashboard (Bureau) — le rôle « administration » se configure côté base ou outil admin */
export const DASHBOARD_ROLES = [
  { value: "admin",  label: "Administrateur", description: "Accès complet au dashboard Bureau" },
  { value: "bureau", label: "Bureau",         description: "Membre du bureau" },
] as const
