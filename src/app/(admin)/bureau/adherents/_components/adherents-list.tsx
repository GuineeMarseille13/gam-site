"use client"

import { useCallback, useEffect, useMemo, useState, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { BureauContent } from "@/components/bureau/bureau-content"
import { Button } from "@/components/ui/button"
import type { AdherentListRow } from "@/lib/schemas/adherent-list.schema"
import { IconIdBadge2 } from "@tabler/icons-react"
import { AdminTablePagination } from "@/app/(admin)/_shared/_components/admin-table-pagination"

import type { AdherentsSearchParams } from "../_schemas/adherents-search-params.schema"
import type { StatusFilter } from "../_utils/adherent-list-filters"
import { AdherentDetailSheet } from "./adherent-detail-sheet"
import { AdherentsFilterBar } from "./adherents-filter-bar"
import { AdherentsRows } from "./adherents-rows"

interface AdherentsListProps {
  rows: AdherentListRow[]
  totalFiltered: number
  totalAdherents: number
  availableYears: number[]
  searchValues: AdherentsSearchParams
  pagination: {
    page: number
    total: number
    searchParams: Record<string, string | string[] | undefined>
  }
}

/**
 * Liste des adhérents (lecture seule) avec filtres synchronisés à l'URL.
 */
export function AdherentsList({
  rows,
  totalFiltered,
  totalAdherents,
  availableYears,
  searchValues,
  pagination,
}: AdherentsListProps) {
  const router = useRouter()
  const pathname = usePathname()
  const urlSearchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const [search, setSearch] = useState(searchValues.q ?? "")
  const [detailPersonId, setDetailPersonId] = useState<string | null>(null)

  const yearFilter = searchValues.annee ?? null
  const statusFilter: StatusFilter = searchValues.statut ?? "tous"

  useEffect(() => {
    setSearch(searchValues.q ?? "")
  }, [searchValues.q])

  const yearSelectOptions = useMemo(() => {
    const set = new Set<number>(availableYears)
    if (yearFilter !== null) set.add(yearFilter)
    return [...set].sort((a, b) => b - a)
  }, [availableYears, yearFilter])

  const replaceSearchParams = useCallback(
    (next: Record<string, string | undefined>) => {
      const params = new URLSearchParams(urlSearchParams.toString())

      for (const [key, value] of Object.entries(next)) {
        if (!value) params.delete(key)
        else params.set(key, value)
      }

      params.delete("page")

      const qs = params.toString()
      startTransition(() => {
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
      })
    },
    [pathname, router, startTransition, urlSearchParams],
  )

  useEffect(() => {
    const handle = window.setTimeout(() => {
      const currentQ = searchValues.q ?? ""
      if (search.trim() === currentQ.trim()) return
      replaceSearchParams({ q: search.trim() || undefined })
    }, 300)

    return () => window.clearTimeout(handle)
  }, [replaceSearchParams, search, searchValues.q])

  const handleYearFilterChange = useCallback(
    (year: number | null) => {
      replaceSearchParams({
        annee: year !== null ? String(year) : undefined,
      })
    },
    [replaceSearchParams],
  )

  const handleStatusFilterChange = useCallback(
    (value: StatusFilter) => {
      replaceSearchParams({
        statut: value === "tous" ? undefined : value,
      })
    },
    [replaceSearchParams],
  )

  const handleResetFilters = useCallback(() => {
    setSearch("")
    startTransition(() => {
      router.replace(pathname, { scroll: false })
    })
  }, [pathname, router, startTransition])

  const description =
    totalAdherents === 0
      ? "Aucune adhésion enregistrée pour le moment"
      : `${totalAdherents} adhérent${totalAdherents > 1 ? "s" : ""} — ${totalFiltered} affiché${totalFiltered > 1 ? "s" : ""}`

  return (
    <BureauContent title="Adhérents" description={description} dashboard="bureau">
      <AdherentDetailSheet
        personId={detailPersonId}
        onClose={() => setDetailPersonId(null)}
      />

      {totalAdherents > 0 && (
        <AdherentsFilterBar
          adherentsCount={totalAdherents}
          search={search}
          onSearchChange={setSearch}
          yearFilter={yearFilter}
          onYearFilterChange={handleYearFilterChange}
          yearOptions={yearSelectOptions}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
          onResetFilters={handleResetFilters}
        />
      )}

      {totalAdherents === 0 ? (
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
      ) : rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-amber-500/25 bg-amber-500/[0.06] py-16 text-center dark:bg-amber-500/[0.05]">
          <p className="text-sm font-semibold text-foreground">
            Aucun résultat pour ces filtres
          </p>
          <Button type="button" variant="outline" size="sm" onClick={handleResetFilters}>
            Réinitialiser les filtres
          </Button>
        </div>
      ) : (
        <AdherentsRows
          rows={rows}
          yearFilter={yearFilter}
          onOpenDetail={setDetailPersonId}
        />
      )}

      <AdminTablePagination
        pathname="/bureau/adherents"
        total={pagination.total}
        page={pagination.page}
        searchParams={pagination.searchParams}
        className="mt-4"
      />
    </BureauContent>
  )
}
