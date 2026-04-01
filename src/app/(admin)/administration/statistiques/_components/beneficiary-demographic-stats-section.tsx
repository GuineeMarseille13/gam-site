import { Card, CardContent } from "@/components/ui/card"

import type { BeneficiaryDemographicStatsPayload } from "../../_schemas/beneficiary-demographic-stats.schema"
import { BeneficiaryDemographicMonthlyChart } from "./beneficiary-demographic-monthly-chart"
import { BeneficiaryDemographicStatsTables } from "./beneficiary-demographic-stats-tables"

interface BeneficiaryDemographicStatsSectionProps {
  year: number
  data: BeneficiaryDemographicStatsPayload
}

/**
 * Effectifs bénéficiaires à la permanence administrative : mineurs / majeurs (âge à la date de passage), par mois et par journée.
 */
export function BeneficiaryDemographicStatsSection({
  year,
  data,
}: BeneficiaryDemographicStatsSectionProps) {
  const t = data.yearTotals
  const yearTotal = t.minor + t.adultAccompanied + t.unknownAge
  const isEmpty = yearTotal === 0

  return (
    <section
      className="space-y-6 border-t border-border/60 pt-10"
      aria-labelledby="adm-stats-bene-demographic-heading"
    >
      <div className="min-w-0 max-w-3xl space-y-2">
        <h2
          id="adm-stats-bene-demographic-heading"
          className="text-lg font-semibold tracking-tight text-foreground"
        >
          Bénéficiaires à la permanence — {year}
        </h2>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Mineur</span> : moins de 18 ans révolus à la
          date de la permanence (date de naissance renseignée).{" "}
          <span className="font-medium text-foreground">Majeur accompagné</span> : 18 ans ou plus ce
          jour-là. Les fiches sans date de naissance sont comptées à part (âge non renseigné). Une
          ligne = une fiche enregistrée pour une date de permanence donnée.
        </p>
      </div>

      {isEmpty ? (
        <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 px-4 py-12 text-center">
          <p className="text-sm font-medium text-foreground">Aucun bénéficiaire enregistré pour {year}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Les statistiques apparaissent lorsque des demandes sont saisies sur l’année sélectionnée.
          </p>
        </div>
      ) : (
        <>
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <li>
              <Card className="border border-border/80 border-l-4 border-l-chart-4 bg-card shadow-sm">
                <CardContent className="p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Mineurs
                  </p>
                  <p className="mt-1 text-3xl font-bold tabular-nums text-chart-4">{t.minor}</p>
                </CardContent>
              </Card>
            </li>
            <li>
              <Card className="border border-border/80 border-l-4 border-l-chart-3 bg-card shadow-sm">
                <CardContent className="p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Majeurs accompagnés
                  </p>
                  <p className="mt-1 text-3xl font-bold tabular-nums text-chart-3">
                    {t.adultAccompanied}
                  </p>
                </CardContent>
              </Card>
            </li>
            <li>
              <Card className="border border-border/80 border-l-4 border-l-chart-2 bg-card shadow-sm">
                <CardContent className="p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Âge non renseigné
                  </p>
                  <p className="mt-1 text-3xl font-bold tabular-nums text-chart-2">{t.unknownAge}</p>
                </CardContent>
              </Card>
            </li>
            <li>
              <Card className="border-border/80 bg-muted/25 shadow-sm">
                <CardContent className="p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Total fiches
                  </p>
                  <p className="mt-1 text-3xl font-bold tabular-nums text-foreground">{yearTotal}</p>
                </CardContent>
              </Card>
            </li>
          </ul>

          <div className="space-y-2">
            <h3 className="text-base font-semibold text-foreground">Répartition mensuelle ({year})</h3>
            <div className="rounded-xl border border-border/80 bg-card p-2 shadow-sm sm:p-4">
              <BeneficiaryDemographicMonthlyChart rows={data.byMonth} />
            </div>
          </div>

          <BeneficiaryDemographicStatsTables
            byMonth={data.byMonth}
            byPermanence={data.byPermanence}
          />
        </>
      )}
    </section>
  )
}
