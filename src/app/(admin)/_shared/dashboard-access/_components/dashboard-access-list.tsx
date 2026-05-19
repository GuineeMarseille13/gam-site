"use client"

import { useMemo, useState, useCallback } from "react"
import Link from "next/link"
import { IconKey, IconPlus } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import type { DashboardAccessScope } from "@/config/dashboard-access-scope"
import { getDashboardAccessAccentClasses } from "@/config/dashboard-access-accent-theme"
import { cn } from "@/helpers/utils"
import {
  ACCESS_LIST_HEADER_GRID_ADMIN,
  ACCESS_LIST_HEADER_GRID_VIEW,
} from "@/app/(admin)/bureau/acces/_components/dashboard-access-list-layout"
import { filterAccessListRowsExcludingSessionUser } from "../_helpers/access-list-session-rules"
import type { DashboardAccessRow, DashboardAccessListActions } from "../_types/dashboard-access-row"
import { DashboardAccessMobileCard } from "./dashboard-access-mobile-card"
import { DashboardAccessDesktopRow } from "./dashboard-access-desktop-row"
import {
  DashboardAccessListToolbar,
  type DashboardAccessListFilter,
} from "./dashboard-access-list-toolbar"

interface DashboardAccessListProps {
  scope: DashboardAccessScope
  rows: DashboardAccessRow[]
  roleLabels: Record<string, string>
  isAdmin: boolean
  currentUserId: string
  actions: DashboardAccessListActions
}

/**
 * Liste des accès dashboard : filtres, cartes mobile, tableau desktop, actions admin.
 */
export function DashboardAccessList({
  scope,
  rows,
  roleLabels,
  isAdmin,
  currentUserId,
  actions,
}: DashboardAccessListProps) {
  const accent = getDashboardAccessAccentClasses(scope)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<DashboardAccessListFilter>("all")

  const visibleRows = useMemo(
    () => filterAccessListRowsExcludingSessionUser(rows, currentUserId),
    [rows, currentUserId],
  )

  const counts = useMemo(
    () => ({
      all: visibleRows.length,
      active: visibleRows.filter((r) => !r.banned).length,
      banned: visibleRows.filter((r) => r.banned).length,
    }),
    [visibleRows],
  )

  const filteredRows = useMemo(() => {
    if (filter === "active") return visibleRows.filter((r) => !r.banned)
    if (filter === "banned") return visibleRows.filter((r) => r.banned)
    return visibleRows
  }, [visibleRows, filter])

  const handleError = useCallback((message: string) => {
    setError(message)
  }, [])

  const bindBan = useCallback(
    (userId: string) => () => actions.banAccess(userId),
    [actions],
  )
  const bindUnban = useCallback(
    (userId: string) => () => actions.unbanAccess(userId),
    [actions],
  )
  const bindRevoke = useCallback(
    (userId: string) => () => actions.revokeAccess(userId),
    [actions],
  )

  if (visibleRows.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-5 rounded-2xl border border-dashed bg-gradient-to-b px-6 py-16 text-center",
          accent.emptyBorder,
          accent.emptyGradient,
        )}
      >
        <span
          className={cn(
            "flex size-14 items-center justify-center rounded-2xl shadow-sm",
            accent.emptyIconBg,
            accent.emptyIconText,
          )}
        >
          <IconKey className="size-7" aria-hidden />
        </span>
        <div className="max-w-md space-y-1">
          <p className="text-base font-semibold text-foreground">{scope.labels.emptyListTitle}</p>
          <p className="text-sm text-muted-foreground">{scope.labels.emptyListDescription}</p>
        </div>
        {isAdmin && (
          <Button asChild className={accent.primaryCta}>
            <Link href={`${scope.accesPath}/nouveau`}>
              <IconPlus className="size-4" />
              {scope.labels.createCta}
            </Link>
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200/60 bg-rose-50/90 px-4 py-3 text-sm text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/35 dark:text-rose-200"
        >
          {error}
        </div>
      )}

      <DashboardAccessListToolbar
        scope={scope}
        filter={filter}
        counts={counts}
        onFilterChange={setFilter}
      />

      {filteredRows.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border/60 bg-muted/10 px-4 py-10 text-center text-sm text-muted-foreground">
          Aucun accès dans cette catégorie.
        </p>
      ) : (
        <>
          <ul className="flex flex-col gap-3 lg:hidden" aria-label={scope.labels.listAriaLabel}>
            {filteredRows.map((row) => (
              <li key={row.userId}>
                <DashboardAccessMobileCard
                  scope={scope}
                  row={row}
                  roleLabels={roleLabels}
                  isAdmin={isAdmin}
                  isSelf={row.userId === currentUserId}
                  onBan={bindBan(row.userId)}
                  onUnban={bindUnban(row.userId)}
                  onRevoke={bindRevoke(row.userId)}
                  onError={handleError}
                />
              </li>
            ))}
          </ul>

          <section
            className="hidden overflow-hidden rounded-2xl border border-border/60 bg-card/50 shadow-sm ring-1 ring-border/20 lg:block"
            aria-label={scope.labels.tableAriaLabel}
          >
            <header className={isAdmin ? ACCESS_LIST_HEADER_GRID_ADMIN : ACCESS_LIST_HEADER_GRID_VIEW}>
              <span className="min-w-0 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Compte
              </span>
              <span className="min-w-0 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Rôle
              </span>
              <span className="min-w-0 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Statut
              </span>
              {isAdmin && (
                <span className="min-w-0 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Actions
                </span>
              )}
            </header>

            <div>
              {filteredRows.map((row) => (
                <DashboardAccessDesktopRow
                  key={row.userId}
                  scope={scope}
                  row={row}
                  roleLabels={roleLabels}
                  isAdmin={isAdmin}
                  isSelf={row.userId === currentUserId}
                  onBan={bindBan(row.userId)}
                  onUnban={bindUnban(row.userId)}
                  onRevoke={bindRevoke(row.userId)}
                  onError={handleError}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
