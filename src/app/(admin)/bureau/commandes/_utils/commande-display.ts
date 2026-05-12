const AVATAR_VARIANTS = [
  "bg-blue-100 text-blue-700",
  "bg-amber-100 text-amber-700",
  "bg-violet-100 text-violet-700",
  "bg-emerald-100 text-emerald-700",
  "bg-rose-100 text-rose-700",
] as const

export const COMMANDE_STATUS_CONFIG: Record<
  string,
  { label: string; className: string }
> = {
  PAID: {
    label: "Payée",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  PENDING: {
    label: "En attente",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  FAILED: {
    label: "Échouée",
    className: "bg-red-100 text-red-700 border-red-200",
  },
  CANCELLED: {
    label: "Annulée",
    className: "bg-gray-100 text-gray-600 border-gray-200",
  },
  REFUNDED: {
    label: "Remboursée",
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
}

export function formatCommandeDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

export function getCommandeInitials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase()
}

export function getCommandeAvatarClass(seedName: string): string {
  const code = seedName.charCodeAt(0)
  const idx = Number.isFinite(code) ? code % AVATAR_VARIANTS.length : 0
  return AVATAR_VARIANTS[idx] ?? AVATAR_VARIANTS[0]
}
