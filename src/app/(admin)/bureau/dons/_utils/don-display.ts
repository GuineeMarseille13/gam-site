const AVATAR_VARIANTS = [
  "bg-rose-100 text-rose-700",
  "bg-amber-100 text-amber-700",
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-violet-100 text-violet-700",
] as const

export function formatDonDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

export function getDonInitials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase()
}

export function getDonAvatarClass(seedName: string): string {
  const code = seedName.charCodeAt(0)
  const idx = Number.isFinite(code) ? code % AVATAR_VARIANTS.length : 0
  return AVATAR_VARIANTS[idx] ?? AVATAR_VARIANTS[0]
}

