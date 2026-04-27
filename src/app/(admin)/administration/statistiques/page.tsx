import type { Metadata } from "next"
import { BureauContent } from "@/components/bureau/bureau-content"
import { permanenceStatsYearParamSchema } from "../_schemas/permanence-hours-annual-stats.schema"
import { getBeneficiaryDemographicStats } from "../_services/get-beneficiary-demographic-stats"
import { getPermanenceAnnualHoursByVolunteer } from "../_services/get-permanence-annual-hours-by-volunteer"
import { BeneficiaryDemographicStatsSection } from "./_components/beneficiary-demographic-stats-section"
import { PermanenceAnnualHoursStatsSection } from "./_components/permanence-annual-hours-stats-section"

export const metadata: Metadata = {
  title: "Statistiques",
  description:
    "Indicateurs administration — heures de permanence ADM et bénéficiaires (mineurs / majeurs) par mois et par journée.",
}

function firstParam(v: string | string[] | undefined): string | undefined {
  if (v == null) return undefined
  return Array.isArray(v) ? v[0] : v
}

export default async function AdministrationStatistiquesPage({
  searchParams,
}: {
  searchParams: Promise<{ annee?: string | string[] }>
}) {
  const sp = await searchParams
  const rawYear = firstParam(sp.annee)
  const parsedYear = permanenceStatsYearParamSchema.safeParse(rawYear)
  const year = parsedYear.success ? parsedYear.data : new Date().getFullYear()

  const [rows, beneficiaryDemographics] = await Promise.all([
    getPermanenceAnnualHoursByVolunteer(year),
    getBeneficiaryDemographicStats(year),
  ])

  return (
    <BureauContent
      title="Statistiques"
      description="Indicateurs issus des saisies du dashboard administration (permanence ADM, etc.)."
    >
      <div className="space-y-12">
        <PermanenceAnnualHoursStatsSection year={year} rows={rows} />
        <BeneficiaryDemographicStatsSection year={year} data={beneficiaryDemographics} />
      </div>
    </BureauContent>
  )
}
