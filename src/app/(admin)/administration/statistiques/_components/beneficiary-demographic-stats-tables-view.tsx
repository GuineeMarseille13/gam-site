import { format, parseISO } from "date-fns"
import { fr } from "date-fns/locale"

import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import type {
  BeneficiaryDemographicByMonthRow,
  BeneficiaryDemographicByPermanenceRow,
} from "../../_schemas/beneficiary-demographic-stats.schema"

export interface BeneficiaryDemographicStatsTablesViewProps {
  byMonth: BeneficiaryDemographicByMonthRow[]
  byPermanence: BeneficiaryDemographicByPermanenceRow[]
  /** Libellé de la ligne de totaux (ex. total année vs période filtrée). */
  totalsRowLabel: string
}

function formatPermanenceHeading(ymd: string): string {
  return format(parseISO(ymd), "EEEE d MMMM yyyy", { locale: fr })
}

/**
 * Rendu des tableaux détail (données déjà filtrées côté parent si besoin).
 */
export function BeneficiaryDemographicStatsTablesView({
  byMonth,
  byPermanence,
  totalsRowLabel,
}: BeneficiaryDemographicStatsTablesViewProps) {
  const monthGrand = byMonth.reduce(
    (acc, r) => ({
      minor: acc.minor + r.minor,
      adultAccompanied: acc.adultAccompanied + r.adultAccompanied,
      unknownAge: acc.unknownAge + r.unknownAge,
      total: acc.total + r.total,
    }),
    { minor: 0, adultAccompanied: 0, unknownAge: 0, total: 0 },
  )

  const permGrand = byPermanence.reduce(
    (acc, r) => ({
      minor: acc.minor + r.minor,
      adultAccompanied: acc.adultAccompanied + r.adultAccompanied,
      unknownAge: acc.unknownAge + r.unknownAge,
      total: acc.total + r.total,
    }),
    { minor: 0, adultAccompanied: 0, unknownAge: 0, total: 0 },
  )

  return (
    <div className="grid min-w-0 gap-8 lg:grid-cols-2 lg:gap-10">
      <div className="min-w-0 space-y-3">
        <h3 className="text-base font-semibold text-foreground">Par mois</h3>
        {byMonth.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune ligne pour ce filtre.</p>
        ) : (
          <>
            <ul className="grid gap-2 lg:hidden">
              {byMonth.map((r) => (
                <li key={r.monthKey}>
                  <Card className="border-border/70 shadow-sm">
                    <CardContent className="space-y-2 p-4">
                      <p className="text-sm font-semibold capitalize text-foreground">
                        {r.monthLabel}
                      </p>
                      <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm tabular-nums">
                        <dt className="text-muted-foreground">Mineurs</dt>
                        <dd className="text-right font-medium text-chart-4">{r.minor}</dd>
                        <dt className="text-muted-foreground">Majeurs</dt>
                        <dd className="text-right font-medium text-chart-3">{r.adultAccompanied}</dd>
                        <dt className="text-muted-foreground">Âge N.R.</dt>
                        <dd className="text-right font-medium text-chart-2">{r.unknownAge}</dd>
                        <dt className="col-span-2 mt-1 border-t border-border/60 pt-2 font-medium text-foreground">
                          Total
                        </dt>
                        <dd className="col-span-2 text-right text-base font-bold">{r.total}</dd>
                      </dl>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
            <div className="hidden overflow-x-auto rounded-xl border border-border/80 lg:block">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="min-w-[140px]">Mois</TableHead>
                    <TableHead className="w-24 text-right tabular-nums">Mineurs</TableHead>
                    <TableHead className="w-28 text-right tabular-nums">Majeurs</TableHead>
                    <TableHead className="w-28 text-right tabular-nums">Âge N.R.</TableHead>
                    <TableHead className="w-24 text-right tabular-nums">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {byMonth.map((r) => (
                    <TableRow key={r.monthKey} className="hover:bg-muted/40">
                      <TableCell className="font-medium capitalize">{r.monthLabel}</TableCell>
                      <TableCell className="text-right tabular-nums text-chart-4">{r.minor}</TableCell>
                      <TableCell className="text-right tabular-nums text-chart-3">
                        {r.adultAccompanied}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-chart-2">
                        {r.unknownAge}
                      </TableCell>
                      <TableCell className="text-right text-base font-semibold tabular-nums">
                        {r.total}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableCell className="font-semibold">{totalsRowLabel}</TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {monthGrand.minor}
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {monthGrand.adultAccompanied}
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {monthGrand.unknownAge}
                    </TableCell>
                    <TableCell className="text-right text-base font-bold tabular-nums">
                      {monthGrand.total}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </>
        )}
      </div>

      <div className="min-w-0 space-y-3">
        <h3 className="text-base font-semibold text-foreground">Par permanence (journée)</h3>
        {byPermanence.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune permanence pour ce filtre.</p>
        ) : (
          <>
            <ul className="grid gap-2 xl:hidden">
              {byPermanence.map((r) => (
                <li key={r.permanenceDate}>
                  <Card className="border-border/70 shadow-sm">
                    <CardContent className="space-y-2 p-4">
                      <p className="text-sm font-semibold capitalize leading-snug text-foreground">
                        {formatPermanenceHeading(r.permanenceDate)}
                      </p>
                      <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm tabular-nums">
                        <dt className="text-muted-foreground">Mineurs</dt>
                        <dd className="text-right font-medium text-chart-4">{r.minor}</dd>
                        <dt className="text-muted-foreground">Majeurs</dt>
                        <dd className="text-right font-medium text-chart-3">{r.adultAccompanied}</dd>
                        <dt className="text-muted-foreground">Âge N.R.</dt>
                        <dd className="text-right font-medium text-chart-2">{r.unknownAge}</dd>
                        <dt className="col-span-2 mt-1 border-t border-border/60 pt-2 font-medium text-foreground">
                          Total
                        </dt>
                        <dd className="col-span-2 text-right text-base font-bold">{r.total}</dd>
                      </dl>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
            <div className="hidden overflow-x-auto rounded-xl border border-border/80 xl:block">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="min-w-[200px]">Date de permanence</TableHead>
                    <TableHead className="w-24 text-right tabular-nums">Mineurs</TableHead>
                    <TableHead className="w-28 text-right tabular-nums">Majeurs</TableHead>
                    <TableHead className="w-28 text-right tabular-nums">Âge N.R.</TableHead>
                    <TableHead className="w-24 text-right tabular-nums">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {byPermanence.map((r) => (
                    <TableRow key={r.permanenceDate} className="hover:bg-muted/40">
                      <TableCell className="font-medium capitalize">
                        {formatPermanenceHeading(r.permanenceDate)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-chart-4">{r.minor}</TableCell>
                      <TableCell className="text-right tabular-nums text-chart-3">
                        {r.adultAccompanied}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-chart-2">
                        {r.unknownAge}
                      </TableCell>
                      <TableCell className="text-right text-base font-semibold tabular-nums">
                        {r.total}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableCell className="font-semibold">{totalsRowLabel}</TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {permGrand.minor}
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {permGrand.adultAccompanied}
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {permGrand.unknownAge}
                    </TableCell>
                    <TableCell className="text-right text-base font-bold tabular-nums">
                      {permGrand.total}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
