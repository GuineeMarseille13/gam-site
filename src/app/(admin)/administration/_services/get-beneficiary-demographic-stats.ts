import { format, parse } from "date-fns"
import { fr } from "date-fns/locale"

import { prisma } from "@/lib/prisma"
import { requireAdministrationDashboard } from "@/lib/auth-guard"

import { aggregateBeneficiaryDemographicStats } from "../_lib/aggregate-beneficiary-demographic-stats"
import {
  beneficiaryDemographicByMonthRowSchema,
  beneficiaryDemographicByPermanenceRowSchema,
  beneficiaryDemographicStatsPayloadSchema,
  type BeneficiaryDemographicStatsPayload,
} from "../_schemas/beneficiary-demographic-stats.schema"

function sumCounts(c: { minor: number; adultAccompanied: number; unknownAge: number }): number {
  return c.minor + c.adultAccompanied + c.unknownAge
}

/**
 * Statistiques bénéficiaires (mineurs / majeurs à la permanence) pour une année civile,
 * ventilées par mois et par date de permanence.
 */
export async function getBeneficiaryDemographicStats(
  year: number,
): Promise<BeneficiaryDemographicStatsPayload> {
  await requireAdministrationDashboard()

  const yearStart = new Date(`${year}-01-01T00:00:00.000Z`)
  const yearEnd = new Date(`${year}-12-31T23:59:59.999Z`)

  const rawRows = await prisma.beneficiary.findMany({
    where: {
      permanenceDate: {
        gte: yearStart,
        lte: yearEnd,
      },
    },
    select: {
      permanenceDate: true,
      birthDate: true,
    },
  })

  const aggregated = aggregateBeneficiaryDemographicStats(rawRows)

  const byMonth = [...aggregated.byMonth.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([monthKey, counts]) =>
      beneficiaryDemographicByMonthRowSchema.parse({
        monthKey,
        monthLabel: format(parse(`${monthKey}-01`, "yyyy-MM-dd", new Date()), "MMMM yyyy", {
          locale: fr,
        }),
        minor: counts.minor,
        adultAccompanied: counts.adultAccompanied,
        unknownAge: counts.unknownAge,
        total: sumCounts(counts),
      }),
    )

  const byPermanence = [...aggregated.byPermanenceYmd.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([permanenceDate, counts]) =>
      beneficiaryDemographicByPermanenceRowSchema.parse({
        permanenceDate,
        minor: counts.minor,
        adultAccompanied: counts.adultAccompanied,
        unknownAge: counts.unknownAge,
        total: sumCounts(counts),
      }),
    )

  return beneficiaryDemographicStatsPayloadSchema.parse({
    year,
    yearTotals: aggregated.yearTotals,
    byMonth,
    byPermanence,
  })
}
