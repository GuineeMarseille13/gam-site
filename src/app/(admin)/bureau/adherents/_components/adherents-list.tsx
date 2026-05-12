"use client"

import { useMemo, useState, useCallback } from "react"

import { BureauContent } from "@/components/bureau/bureau-content"
import { Button } from "@/components/ui/button"
import type { AdherentListRow } from "@/lib/schemas/adherent-list.schema"
import { IconIdBadge2 } from "@tabler/icons-react"

import { useAdherentsDashboard } from "../_hooks/use-adherents-dashboard"
import { useAdherentYearFromUrl } from "../_hooks/use-adherent-year-from-url"
import {
  filterAdherentRows,
  type StatusFilter,
} from "../_utils/adherent-list-filters"
import { AdherentDetailSheet } from "./adherent-detail-sheet"
import { AdherentsFilterBar } from "./adherents-filter-bar"
import { AdherentsRows } from "./adherents-rows"

const EMPTY_ADHERENT_ROWS: AdherentListRow[] = []

/**
 * Liste des adhérents (lecture seule) avec filtres recherche, année (URL ?annee=) et statut de cotisation.
 */
export function AdherentsList() {
  const { data, isPending, isError, error, refetch } = useAdherentsDashboard()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("tous")
  const [detailPersonId, setDetailPersonId] = useState<string | null>(null)

  const adherents = data ?? EMPTY_ADHERENT_ROWS

  const { yearFilter, setYearFilter, yearSelectOptions } =
    useAdherentYearFromUrl(adherents)

  const filtered = useMemo(
    () => filterAdherentRows(adherents, search, yearFilter, statusFilter),
    [adherents, search, yearFilter, statusFilter],
  )

  const handleResetFilters = useCallback(() => {
    setSearch("")
    setStatusFilter("tous")
    setYearFilter(null)
  }, [setYearFilter])

  const description =
    adherents.length === 0
      ? "Aucune adhésion enregistrée pour le moment"
      : `${adherents.length} adhérent${adherents.length > 1 ? "s" : ""} — ${filtered.length} affiché${filtered.length > 1 ? "s" : ""}`

  if (isPending && data === undefined) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8 xl:p-10">
        <div className="space-y-3">
          <div className="h-9 w-52 animate-pulse rounded-xl bg-gradient-to-r from-muted/50 to-muted/20 sm:w-60" />
          <div className="h-4 w-full max-w-md animate-pulse rounded-lg bg-muted/35" />
        </div>
        <div className="h-24 max-w-full animate-pulse rounded-3xl bg-gradient-to-br from-muted/40 via-muted/25 to-transparent ring-1 ring-border/30" />
        <div className="min-h-[14rem] animate-pulse rounded-3xl bg-gradient-to-br from-muted/30 to-muted/10 ring-1 ring-border/20" />
      </div>
    )
  }

  if (isError) {
    return (
      <BureauContent
        title="Adhérents"
        description="Impossible de charger la liste."
        dashboard="bureau"
      >
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-12 text-center">
          <p className="text-sm text-muted-foreground">
            {error.message ?? "Une erreur est survenue."}
          </p>
          <Button type="button" variant="outline" size="sm" onClick={() => void refetch()}>
            Réessayer
          </Button>
        </div>
      </BureauContent>
    )
  }

  return (
    <BureauContent title="Adhérents" description={description} dashboard="bureau">
      <AdherentDetailSheet
        personId={detailPersonId}
        onClose={() => setDetailPersonId(null)}
      />
      {adherents.length > 0 && (
        <AdherentsFilterBar
          adherents={adherents}
          search={search}
          onSearchChange={setSearch}
          yearFilter={yearFilter}
          onYearFilterChange={setYearFilter}
          yearOptions={yearSelectOptions}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onResetFilters={handleResetFilters}
        />
      )}

      {adherents.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-5 rounded-3xl border border-dashed border-border/60 bg-gradient-to-b from-muted/25 to-transparent py-16 text-center ring-1 ring-white/[0.02]">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 shadow-inner ring-1 ring-amber-500/20">
            <IconIdBadge2 className="size-6 text-amber-600/80 dark:text-amber-400/90" />
          </div>
          <div className="max-w-sm px-4">
            <p className="text-base font-semibold tracking-tight text-foreground">Aucun adhérent</p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Les adhérents apparaissent ici lorsqu&apos;ils ont payé leur adhésion.
            </p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-amber-500/25 bg-amber-500/[0.06] py-16 text-center dark:bg-amber-500/[0.05]">
          <p className="text-sm font-semibold text-foreground">
            Aucun résultat pour ces filtres
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-amber-900/25 transition hover:from-amber-400 hover:to-amber-500"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <AdherentsRows
          rows={filtered}
          yearFilter={yearFilter}
          onOpenDetail={setDetailPersonId}
        />
      )}
    </BureauContent>
  )
}
