"use client"

import { useMemo, useState, useCallback } from "react"
import { BureauContent } from "@/components/bureau/bureau-content"
import type { AdherentListRow } from "@/lib/schemas/adherent-list.schema"
import { IconIdBadge2 } from "@tabler/icons-react"
import { AdherentsFilterBar } from "./adherents-filter-bar"
import { AdherentsRows } from "./adherents-rows"
import { filterAdherentRows, type StatusFilter } from "../_utils/adherent-list-filters"
import { useAdherentYearFromUrl } from "../_hooks/use-adherent-year-from-url"

interface AdherentsListProps {
  adherents: AdherentListRow[]
}

/**
 * Liste des adhérents (lecture seule) avec filtres recherche, année (URL ?annee=) et statut de cotisation.
 */
export function AdherentsList({ adherents }: AdherentsListProps) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("tous")

  const { yearFilter, setYearFilter, availableYears } = useAdherentYearFromUrl(adherents)

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

  return (
    <BureauContent title="Adhérents" description={description} dashboard="bureau">
      {adherents.length > 0 && (
        <AdherentsFilterBar
          adherents={adherents}
          search={search}
          onSearchChange={setSearch}
          yearFilter={yearFilter}
          onYearFilterChange={setYearFilter}
          yearOptions={availableYears}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onResetFilters={handleResetFilters}
        />
      )}

      {adherents.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-muted/20 py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-muted/60">
            <IconIdBadge2 className="size-5 text-muted-foreground/50" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Aucun adhérent</p>
            <p className="mt-0.5 max-w-sm text-xs text-muted-foreground">
              Les adhérents apparaissent ici lorsqu&apos;ils ont payé leur adhésion.
            </p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-muted/15 py-14 text-center">
          <p className="text-sm font-medium text-foreground">Aucun résultat pour ces filtres</p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-xs font-semibold text-amber-700 underline-offset-4 hover:underline dark:text-amber-400"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <AdherentsRows rows={filtered} />
      )}
    </BureauContent>
  )
}
