/**
 * Libellé du profil métier d’une personne (hors rôle dashboard).
 */
export function resolvePersonProfileKind(input: {
  hasTeamMember: boolean
  isVolunteer: boolean
  memberShipCount: number
}): string {
  if (input.hasTeamMember) return "Membre du bureau"
  if (input.isVolunteer) return "Bénévole"
  if (input.memberShipCount > 0) return "Adhérent"
  return "Personne"
}
