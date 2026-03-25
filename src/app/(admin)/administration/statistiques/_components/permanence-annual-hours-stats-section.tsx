import { AdministrationPermanenceStatsYearSelect } from "./administration-permanence-stats-year-select"
import { PermanenceAnnualHoursResults } from "./permanence-annual-hours-results"
import type { PermanenceVolunteerAnnualHoursRow } from "../../_schemas/permanence-hours-annual-stats.schema"

interface PermanenceAnnualHoursStatsSectionProps {
  year: number
  rows: PermanenceVolunteerAnnualHoursRow[]
}

/**
 * Bloc stats : heures de permanence ADM agrégées par membre et par année.
 */
export function PermanenceAnnualHoursStatsSection({
  year,
  rows,
}: PermanenceAnnualHoursStatsSectionProps) {
  return (
    <section className="space-y-6" aria-labelledby="adm-stats-perm-heading">
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="min-w-0 max-w-2xl space-y-1">
          <h2 id="adm-stats-perm-heading" className="text-lg font-semibold tracking-tight text-foreground">
            Permanence administrative
          </h2>
          <p className="text-sm text-muted-foreground">
            Total d’heures sur l’année civile pour chaque membre ayant au moins une saisie enregistrée
            (les montants proviennent du formulaire permanence ADM).
          </p>
        </div>
        <div className="w-full shrink-0 sm:w-auto sm:max-w-[200px]">
          <AdministrationPermanenceStatsYearSelect currentYear={year} />
        </div>
      </div>
      <PermanenceAnnualHoursResults year={year} rows={rows} />
    </section>
  )
}
