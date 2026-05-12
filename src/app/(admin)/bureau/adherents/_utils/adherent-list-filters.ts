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

function isActiveForFilteredYear(row: AdherentListRow, year: number | null): boolean {
  if (year === null) {
    return row.hasActiveMembership
  }
  const snap = row.membershipsByYear.find((m) => m.year === year)
  return snap?.isActive ?? false
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
    if (status === "actif" && !isActiveForFilteredYear(row, year)) return false
    if (status === "inactif" && isActiveForFilteredYear(row, year)) return false
    return true
  })
}
