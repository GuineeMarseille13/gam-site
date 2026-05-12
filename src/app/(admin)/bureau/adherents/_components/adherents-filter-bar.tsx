"use client"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/helpers/utils"
import type { AdherentListRow } from "@/lib/schemas/adherent-list.schema"
import { normalizeSearch, type StatusFilter } from "../_utils/adherent-list-filters"
import { IconSearch } from "@tabler/icons-react"

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
    <div className="rounded-3xl border border-border/50 bg-gradient-to-br from-card/80 via-card/50 to-muted/20 p-4 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.25)] ring-1 ring-white/[0.04] backdrop-blur-md dark:from-card/40 dark:via-card/30 dark:to-muted/10 dark:shadow-black/50 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end lg:justify-between lg:gap-5">
        <div className="relative w-full lg:max-w-md lg:flex-1">
          <span className="pointer-events-none absolute left-3.5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground">
            <IconSearch className="size-4" aria-hidden />
          </span>
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher par nom, email, téléphone…"
            className="h-11 rounded-2xl border-border/50 bg-background/70 pl-12 pr-4 text-sm shadow-inner transition-[box-shadow,border-color] placeholder:text-muted-foreground/70 focus-visible:border-amber-500/40 focus-visible:ring-2 focus-visible:ring-amber-500/25 dark:bg-background/40"
            aria-label="Filtrer par texte"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:gap-3">
          <div className="flex w-full flex-col gap-1.5 sm:w-auto">
            <Select
              value={yearSelectValue}
              onValueChange={(value) => {
                onYearFilterChange(value === "all" ? null : Number(value))
              }}
              disabled={adherents.length === 0}
            >
              <SelectTrigger
                className="h-11 w-full min-w-0 rounded-2xl border-border/50 bg-background/70 shadow-sm transition-[border-color,box-shadow] hover:border-border focus-visible:border-amber-500/40 focus-visible:ring-2 focus-visible:ring-amber-500/20 sm:w-[min(100%,13rem)] dark:bg-background/40"
                aria-label="Filtrer par année d'adhésion"
              >
                <SelectValue placeholder="Année" />
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

          <div
            className="flex w-fit flex-wrap items-center gap-1 rounded-2xl border border-border/40 bg-muted/25 p-1 dark:bg-muted/15"
            role="group"
            aria-label="Filtrer par statut de cotisation"
          >
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
                  "rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-200",
                  statusFilter === value
                    ? "bg-gradient-to-b from-amber-500 to-amber-600 text-white shadow-md shadow-amber-900/30 ring-1 ring-amber-400/30 dark:shadow-black/50"
                    : "text-muted-foreground hover:bg-background/60 hover:text-foreground dark:hover:bg-background/20",
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="text-xs font-semibold text-amber-600 underline-offset-4 transition-colors hover:text-amber-500 hover:underline dark:text-amber-400 dark:hover:text-amber-300 sm:mb-0.5"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
