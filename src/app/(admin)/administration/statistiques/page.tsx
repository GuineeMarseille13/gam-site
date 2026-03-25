import type { Metadata } from "next"
import { BureauDataPage } from "@/components/bureau/bureau-data-page"
import { permanenceStatsYearParamSchema } from "../_schemas/permanence-hours-annual-stats.schema"
import { getPermanenceAnnualHoursByVolunteer } from "../_services/get-permanence-annual-hours-by-volunteer"
import { PermanenceAnnualHoursStatsSection } from "./_components/permanence-annual-hours-stats-section"

export const metadata: Metadata = {
  title: "Statistiques",
  description: "Indicateurs du dashboard administration — permanence ADM et autres",
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

  const rows = await getPermanenceAnnualHoursByVolunteer(year)

  return (
    <BureauDataPage
      title="Statistiques"
      description="Indicateurs issus des saisies du dashboard administration (permanence ADM, etc.)."
    >
      <PermanenceAnnualHoursStatsSection year={year} rows={rows} />
    </BureauDataPage>
  )
}
