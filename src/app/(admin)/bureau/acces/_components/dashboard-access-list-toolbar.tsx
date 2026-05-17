"use client"

import { cn } from "@/helpers/utils"
import { Button } from "@/components/ui/button"

export type AccessListFilter = "all" | "active" | "banned"

interface DashboardAccessListToolbarProps {
  filter: AccessListFilter
  counts: { all: number; active: number; banned: number }
  onFilterChange: (filter: AccessListFilter) => void
}

const FILTERS: { id: AccessListFilter; label: string }[] = [
  { id: "all", label: "Tous" },
  { id: "active", label: "Actifs" },
  { id: "banned", label: "Suspendus" },
]

/**
 * Filtres de statut pour la liste des accès dashboard.
 */
export function DashboardAccessListToolbar({
  filter,
  counts,
  onFilterChange,
}: DashboardAccessListToolbarProps) {
  return (
    <div
      className="-mx-1 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-wrap sm:overflow-visible sm:pb-0"
      role="tablist"
      aria-label="Filtrer par statut"
    >
      {FILTERS.map(({ id, label }) => {
        const count = counts[id]
        const isActive = filter === id
        return (
          <Button
            key={id}
            type="button"
            variant={isActive ? "default" : "outline"}
            size="sm"
            role="tab"
            aria-selected={isActive}
            className={cn(
              "h-8 rounded-full px-3.5 text-xs font-medium",
              isActive &&
                "bg-amber-500 text-white shadow-sm hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500",
            )}
            onClick={() => onFilterChange(id)}
          >
            {label}
            <span
              className={cn(
                "ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] tabular-nums",
                isActive ? "bg-white/20" : "bg-muted text-muted-foreground",
              )}
            >
              {count}
            </span>
          </Button>
        )
      })}
    </div>
  )
}
