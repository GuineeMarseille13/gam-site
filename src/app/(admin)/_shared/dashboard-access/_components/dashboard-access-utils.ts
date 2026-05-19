import type { DashboardAccessRow } from "../_types/dashboard-access-row"

export function getDashboardAccessDisplayName(row: DashboardAccessRow): string {
  if (row.person) {
    return `${row.person.firstName} ${row.person.lastName}`
  }
  return row.name
}

export function getDashboardAccessInitials(row: DashboardAccessRow): string {
  const person = row.person
  if (person) {
    const a = person.firstName[0] ?? ""
    const b = person.lastName[0] ?? ""
    if (a || b) return `${a}${b}`.toUpperCase()
  }
  return (
    row.name
      .split(/\s+/)
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  )
}
