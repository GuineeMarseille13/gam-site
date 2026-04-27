import type { AdherentListRow } from "@/lib/schemas/adherent-list.schema"

export type StatusFilter = "tous" | "actif" | "inactif"

export function formatShortDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(iso))
}

export function normalizeSearch(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ")
}

function matchesSearch(row: AdherentListRow, q: string): boolean {
  if (!q) return true
  const haystack = [
    row.firstName,
    row.lastName,
    `${row.firstName} ${row.lastName}`,
    row.email ?? "",
    row.phone,
  ]
    .join(" ")
    .toLowerCase()
  return haystack.includes(q)
}

export function filterAdherentRows(
  rows: AdherentListRow[],
  search: string,
  year: number | null,
  status: StatusFilter,
): AdherentListRow[] {
  const q = normalizeSearch(search)
  return rows.filter((row) => {
    if (!matchesSearch(row, q)) return false
    if (year !== null && !row.years.includes(year)) return false
    if (status === "actif" && !row.hasActiveMembership) return false
    if (status === "inactif" && row.hasActiveMembership) return false
    return true
  })
}
