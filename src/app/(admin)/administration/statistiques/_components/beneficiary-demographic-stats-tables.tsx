"use client"

import { format, parse } from "date-fns"
import { fr } from "date-fns/locale"
import { useCallback, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  collectSortedMonthKeys,
  filterByMonthRange,
  filterPermanenceByMonthRange,
  isFilterActive,
  normalizeMonthRange,
} from "../../_lib/filter-beneficiary-demographic-detail"
import type {
  BeneficiaryDemographicByMonthRow,
  BeneficiaryDemographicByPermanenceRow,
} from "../../_schemas/beneficiary-demographic-stats.schema"
import { BeneficiaryDemographicStatsTablesView } from "./beneficiary-demographic-stats-tables-view"

const FILTER_NONE = "__none__"

interface BeneficiaryDemographicStatsTablesProps {
  byMonth: BeneficiaryDemographicByMonthRow[]
  byPermanence: BeneficiaryDemographicByPermanenceRow[]
}

/**
 * Tableaux détail avec filtres période (mois) : même plage pour la synthèse mensuelle et les journées de permanence.
 */
export function BeneficiaryDemographicStatsTables({
  byMonth,
  byPermanence,
}: BeneficiaryDemographicStatsTablesProps) {
  const [fromRaw, setFromRaw] = useState<string | null>(null)
  const [toRaw, setToRaw] = useState<string | null>(null)

  const { fromMonthKey, toMonthKey } = useMemo(
    () => normalizeMonthRange(fromRaw, toRaw),
    [fromRaw, toRaw],
  )

  const monthKeys = useMemo(
    () => collectSortedMonthKeys(byMonth, byPermanence),
    [byMonth, byPermanence],
  )

  const labelByMonthKey = useMemo(() => {
    const m = new Map<string, string>()
    for (const row of byMonth) m.set(row.monthKey, row.monthLabel)
    return m
  }, [byMonth])

  const monthSelectOptions = useMemo(
    () =>
      monthKeys.map((key) => ({
        value: key,
        label:
          labelByMonthKey.get(key) ??
          format(parse(`${key}-01`, "yyyy-MM-dd", new Date()), "MMMM yyyy", { locale: fr }),
      })),
    [monthKeys, labelByMonthKey],
  )

  const filteredMonth = useMemo(
    () => filterByMonthRange(byMonth, fromMonthKey, toMonthKey),
    [byMonth, fromMonthKey, toMonthKey],
  )

  const filteredPermanence = useMemo(
    () => filterPermanenceByMonthRange(byPermanence, fromMonthKey, toMonthKey),
    [byPermanence, fromMonthKey, toMonthKey],
  )

  const filterActive = isFilterActive(fromMonthKey, toMonthKey)
  const totalsRowLabel = filterActive ? "Total (période affichée)" : "Total année"

  const handleReset = useCallback(() => {
    setFromRaw(null)
    setToRaw(null)
  }, [])

  const hasAnyData = byMonth.length > 0 || byPermanence.length > 0

  if (!hasAnyData) {
    return (
      <div className="grid min-w-0 gap-8 lg:grid-cols-2 lg:gap-10">
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-foreground">Par mois</h3>
          <p className="text-sm text-muted-foreground">Aucune donnée pour cette période.</p>
        </div>
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-foreground">Par permanence (journée)</h3>
          <p className="text-sm text-muted-foreground">
            Aucune permanence enregistrée sur la période.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div
        className="rounded-xl border border-border/80 bg-muted/15 p-4 shadow-sm sm:p-5"
        role="region"
        aria-labelledby="bene-detail-filter-heading"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 space-y-1">
            <h3
              id="bene-detail-filter-heading"
              className="text-sm font-semibold text-foreground"
            >
              Filtrer le détail
            </h3>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Limitez les tableaux « Par mois » et « Par permanence » à une plage de mois (inclusive).
              Les totaux en pied de tableau suivent la sélection.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-9 shrink-0 self-start sm:self-auto"
            onClick={handleReset}
            disabled={!filterActive}
          >
            Réinitialiser
          </Button>
        </div>

        <div className="mt-4 grid min-w-0 gap-4 sm:grid-cols-2 lg:max-w-2xl">
          <div className="flex min-w-0 flex-col gap-2">
            <Label htmlFor="bene-filter-month-from" className="text-muted-foreground">
              À partir du mois
            </Label>
            <Select
              value={fromRaw ?? FILTER_NONE}
              onValueChange={(v) => setFromRaw(v === FILTER_NONE ? null : v)}
            >
              <SelectTrigger id="bene-filter-month-from" className="h-11 w-full sm:h-9 md:max-w-none">
                <SelectValue placeholder="Toute l’année" />
              </SelectTrigger>
              <SelectContent className="max-h-[min(50vh,20rem)]">
                <SelectItem value={FILTER_NONE}>Toute l’année (début)</SelectItem>
                {monthSelectOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    <span className="capitalize">{o.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex min-w-0 flex-col gap-2">
            <Label htmlFor="bene-filter-month-to" className="text-muted-foreground">
              Jusqu’au mois
            </Label>
            <Select
              value={toRaw ?? FILTER_NONE}
              onValueChange={(v) => setToRaw(v === FILTER_NONE ? null : v)}
            >
              <SelectTrigger id="bene-filter-month-to" className="h-11 w-full sm:h-9 md:max-w-none">
                <SelectValue placeholder="Toute l’année" />
              </SelectTrigger>
              <SelectContent className="max-h-[min(50vh,20rem)]">
                <SelectItem value={FILTER_NONE}>Toute l’année (fin)</SelectItem>
                {monthSelectOptions.map((o) => (
                  <SelectItem key={`to-${o.value}`} value={o.value}>
                    <span className="capitalize">{o.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {filterActive ? (
          <p className="mt-3 text-xs text-muted-foreground" aria-live="polite">
            Affichage : {filteredMonth.length} mois · {filteredPermanence.length} journée
            {filteredPermanence.length === 1 ? "" : "s"} de permanence
          </p>
        ) : null}
      </div>

      <BeneficiaryDemographicStatsTablesView
        byMonth={filteredMonth}
        byPermanence={filteredPermanence}
        totalsRowLabel={totalsRowLabel}
      />
    </div>
  )
}
