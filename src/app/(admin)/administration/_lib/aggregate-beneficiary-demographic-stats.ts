/**
 * Agrégation pure des effectifs bénéficiaires (mineur / majeur à la date de permanence).
 * Aucune dépendance Prisma : testable et réutilisable.
 */

export type BeneficiaryDemographicCategory = "minor" | "adultAccompanied" | "unknownAge"

export interface BeneficiaryDemographicCounts {
  readonly minor: number
  readonly adultAccompanied: number
  readonly unknownAge: number
}

export interface BeneficiaryDemographicInputRow {
  readonly permanenceDate: Date
  readonly birthDate: Date | null
}

function emptyCounts(): BeneficiaryDemographicCounts {
  return { minor: 0, adultAccompanied: 0, unknownAge: 0 }
}

/** Âge en années révolues à la date de référence (dates stockées en UTC côté Prisma @db.Date). */
export function computeAgeAtPermanenceUtc(birth: Date, permanenceDate: Date): number {
  const by = birth.getUTCFullYear()
  const bm = birth.getUTCMonth()
  const bd = birth.getUTCDate()
  const py = permanenceDate.getUTCFullYear()
  const pm = permanenceDate.getUTCMonth()
  const pd = permanenceDate.getUTCDate()
  let age = py - by
  if (pm < bm || (pm === bm && pd < bd)) age -= 1
  return age
}

export function categorizeBeneficiaryRow(
  birthDate: Date | null,
  permanenceDate: Date,
): BeneficiaryDemographicCategory {
  if (birthDate == null) return "unknownAge"
  const age = computeAgeAtPermanenceUtc(birthDate, permanenceDate)
  if (age < 0 || age > 120) return "unknownAge"
  if (age < 18) return "minor"
  return "adultAccompanied"
}

function addToCounts(
  counts: BeneficiaryDemographicCounts,
  category: BeneficiaryDemographicCategory,
): BeneficiaryDemographicCounts {
  if (category === "minor") {
    return { ...counts, minor: counts.minor + 1 }
  }
  if (category === "adultAccompanied") {
    return { ...counts, adultAccompanied: counts.adultAccompanied + 1 }
  }
  return { ...counts, unknownAge: counts.unknownAge + 1 }
}

function ymdUtc(d: Date): string {
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, "0")
  const day = String(d.getUTCDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export interface BeneficiaryDemographicAggregation {
  readonly yearTotals: BeneficiaryDemographicCounts
  readonly byMonth: ReadonlyMap<string, BeneficiaryDemographicCounts>
  readonly byPermanenceYmd: ReadonlyMap<string, BeneficiaryDemographicCounts>
}

/**
 * Regroupe les fiches bénéficiaires par totaux annuels, par mois (YYYY-MM) et par date de permanence (YYYY-MM-DD).
 */
export function aggregateBeneficiaryDemographicStats(
  rows: readonly BeneficiaryDemographicInputRow[],
): BeneficiaryDemographicAggregation {
  let yearTotals = emptyCounts()
  const byMonth = new Map<string, BeneficiaryDemographicCounts>()
  const byPermanenceYmd = new Map<string, BeneficiaryDemographicCounts>()

  for (const row of rows) {
    const category = categorizeBeneficiaryRow(row.birthDate, row.permanenceDate)
    yearTotals = addToCounts(yearTotals, category)

    const permKey = ymdUtc(row.permanenceDate)
    const monthKey = permKey.slice(0, 7)

    const prevMonth = byMonth.get(monthKey) ?? emptyCounts()
    byMonth.set(monthKey, addToCounts(prevMonth, category))

    const prevPerm = byPermanenceYmd.get(permKey) ?? emptyCounts()
    byPermanenceYmd.set(permKey, addToCounts(prevPerm, category))
  }

  return { yearTotals, byMonth, byPermanenceYmd }
}
