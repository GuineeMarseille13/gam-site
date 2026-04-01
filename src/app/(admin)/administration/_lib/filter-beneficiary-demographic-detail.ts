/**
 * Filtres pour les tableaux détail (mois et permanences) — comparaisons sur clés YYYY-MM / YYYY-MM-DD.
 */

export function collectSortedMonthKeys(
  byMonth: readonly { monthKey: string }[],
  byPermanence: readonly { permanenceDate: string }[],
): string[] {
  const set = new Set<string>()
  for (const row of byMonth) set.add(row.monthKey)
  for (const row of byPermanence) set.add(row.permanenceDate.slice(0, 7))
  return [...set].sort((a, b) => a.localeCompare(b))
}

/** Si les bornes sont inversées, les permuter pour que le filtre reste cohérent. */
export function normalizeMonthRange(
  fromMonthKey: string | null,
  toMonthKey: string | null,
): { readonly fromMonthKey: string | null; readonly toMonthKey: string | null } {
  if (fromMonthKey != null && toMonthKey != null && fromMonthKey > toMonthKey) {
    return { fromMonthKey: toMonthKey, toMonthKey: fromMonthKey }
  }
  return { fromMonthKey, toMonthKey }
}

export function isMonthKeyInRange(
  monthKey: string,
  fromMonthKey: string | null,
  toMonthKey: string | null,
): boolean {
  if (fromMonthKey != null && monthKey < fromMonthKey) return false
  if (toMonthKey != null && monthKey > toMonthKey) return false
  return true
}

export function filterByMonthRange<T extends { monthKey: string }>(
  rows: readonly T[],
  fromMonthKey: string | null,
  toMonthKey: string | null,
): T[] {
  if (fromMonthKey == null && toMonthKey == null) return [...rows]
  return rows.filter((r) => isMonthKeyInRange(r.monthKey, fromMonthKey, toMonthKey))
}

export function filterPermanenceByMonthRange<T extends { permanenceDate: string }>(
  rows: readonly T[],
  fromMonthKey: string | null,
  toMonthKey: string | null,
): T[] {
  if (fromMonthKey == null && toMonthKey == null) return [...rows]
  return rows.filter((r) =>
    isMonthKeyInRange(r.permanenceDate.slice(0, 7), fromMonthKey, toMonthKey),
  )
}

export function isFilterActive(
  fromMonthKey: string | null,
  toMonthKey: string | null,
): boolean {
  return fromMonthKey != null || toMonthKey != null
}
