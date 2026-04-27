"use client"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { AdherentListRow } from "@/lib/schemas/adherent-list.schema"
import { normalizeSearch, type StatusFilter } from "../_utils/adherent-list-filters"
import { IconCalendar, IconSearch } from "@tabler/icons-react"

interface AdherentsFilterBarProps {
  adherents: AdherentListRow[]
  search: string
  onSearchChange: (value: string) => void
  yearFilter: number | null
  onYearFilterChange: (year: number | null) => void
  yearOptions: readonly number[]
  statusFilter: StatusFilter
  onStatusFilterChange: (value: StatusFilter) => void
  onResetFilters: () => void
}

export function AdherentsFilterBar({
  adherents,
  search,
  onSearchChange,
  yearFilter,
  onYearFilterChange,
  yearOptions,
  statusFilter,
  onStatusFilterChange,
  onResetFilters,
}: AdherentsFilterBarProps) {
  const hasActiveFilters =
    normalizeSearch(search) !== "" || yearFilter !== null || statusFilter !== "tous"

  const yearSelectValue = yearFilter === null ? "all" : String(yearFilter)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher par nom, email, téléphone…"
            className="h-10 rounded-xl border-border bg-background pl-9 pr-3"
            aria-label="Filtrer par texte"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
          <div className="flex w-full flex-col gap-2 sm:w-auto">
            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground/80">
              <IconCalendar className="size-3.5 shrink-0" aria-hidden />
              Année de cotisation
            </span>
            <Select
              value={yearSelectValue}
              onValueChange={(value) => {
                onYearFilterChange(value === "all" ? null : Number(value))
              }}
              disabled={adherents.length === 0}
            >
              <SelectTrigger
                className="h-10 w-full min-w-0 rounded-xl border-border bg-background sm:w-[min(100%,12rem)]"
                aria-label="Filtrer par année de cotisation"
              >
                <SelectValue placeholder="Choisir une année" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="all">Toutes les années</SelectItem>
                {yearOptions.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/80">
              Cotisation
            </span>
            <div className="flex flex-wrap items-center gap-1 rounded-xl border bg-muted/30 p-1">
              {(
                [
                  ["tous", "Tous"],
                  ["actif", "Active"],
                  ["inactif", "Inactive"],
                ] as const
              ).map(([value, label]) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => onStatusFilterChange(value)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                    statusFilter === value
                      ? "bg-background text-foreground shadow-sm ring-1 ring-border/60"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="text-xs font-medium text-amber-700 underline-offset-4 hover:underline dark:text-amber-400 sm:mb-0.5"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
