const AVATAR_VARIANTS = [
  "bg-amber-100 text-amber-700",
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-violet-100 text-violet-700",
  "bg-rose-100 text-rose-700",
] as const

/**
 * Date de fin d’adhésion : toujours le 31 décembre de l’année de cotisation (`MemberShip.year`),
 * quel que soit la date de paiement.
 */
export function getMembershipEndDate(membershipYear: number): Date {
  return new Date(Date.UTC(membershipYear, 11, 31))
}

export function formatAdhesionDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

export function getAdhesionInitials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase()
}

/** Classes Tailwind pour l’avatar selon la première lettre du prénom. */
export function getAdhesionAvatarClass(seedName: string): string {
  const code = seedName.charCodeAt(0)
  const idx = Number.isFinite(code) ? code % AVATAR_VARIANTS.length : 0
  return AVATAR_VARIANTS[idx] ?? AVATAR_VARIANTS[0]
}
