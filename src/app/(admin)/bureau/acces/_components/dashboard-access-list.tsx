"use client"

import { useMemo, useState, useCallback } from "react"
import Link from "next/link"
import { IconKey, IconPlus } from "@tabler/icons-react"
import { filterAccessListRowsExcludingSessionUser } from "@/app/(admin)/_shared/dashboard-access/_helpers/access-list-session-rules"
import type { DashboardAccessRow } from "../_schemas/dashboard-access.schema"
import {
  banDashboardAccess,
  revokeDashboardAccess,
  unbanDashboardAccess,
} from "../_actions/dashboard-access-actions"
import { Button } from "@/components/ui/button"
import { DashboardAccessMobileCard } from "./dashboard-access-mobile-card"
import { DashboardAccessDesktopRow } from "./dashboard-access-desktop-row"
import {
  DashboardAccessListToolbar,
  type AccessListFilter,
} from "./dashboard-access-list-toolbar"
import {
  ACCESS_LIST_HEADER_GRID_ADMIN,
  ACCESS_LIST_HEADER_GRID_VIEW,
} from "./dashboard-access-list-layout"

interface DashboardAccessListProps {
  rows: DashboardAccessRow[]
  isAdmin: boolean
  currentUserId: string
}

/**
 * Liste des accès dashboard : filtres, cartes mobile, tableau desktop, actions admin.
 */
export function DashboardAccessList({ rows, isAdmin, currentUserId }: DashboardAccessListProps) {
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<AccessListFilter>("all")

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
    (userId: string) => () => banDashboardAccess(userId),
    [],
  )
  const bindUnban = useCallback(
    (userId: string) => () => unbanDashboardAccess(userId),
    [],
  )
  const bindRevoke = useCallback(
    (userId: string) => () => revokeDashboardAccess(userId),
    [],
  )

  if (visibleRows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-amber-200/40 bg-gradient-to-b from-amber-50/30 to-transparent px-6 py-16 text-center dark:border-amber-900/30 dark:from-amber-950/20">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 shadow-sm dark:bg-amber-950/50 dark:text-amber-300">
          <IconKey className="size-7" aria-hidden />
        </span>
        <div className="max-w-md space-y-1">
          <p className="text-base font-semibold text-foreground">Aucun accès dashboard</p>
          <p className="text-sm text-muted-foreground">
            Associez une personne existante à un rôle et un mot de passe pour lui ouvrir l&apos;espace
            Bureau ou Administration.
          </p>
        </div>
        {isAdmin && (
          <Button
            asChild
            className="gap-2 rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/20 hover:bg-amber-600"
          >
            <Link href="/bureau/acces/nouveau">
              <IconPlus className="size-4" />
              Créer un accès
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

      <DashboardAccessListToolbar filter={filter} counts={counts} onFilterChange={setFilter} />

      {filteredRows.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border/60 bg-muted/10 px-4 py-10 text-center text-sm text-muted-foreground">
          Aucun accès dans cette catégorie.
        </p>
      ) : (
        <>
          <ul className="flex flex-col gap-3 lg:hidden" aria-label="Liste des accès">
            {filteredRows.map((row) => (
              <li key={row.userId}>
                <DashboardAccessMobileCard
                  row={row}
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
            aria-label="Tableau des accès"
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
                  row={row}
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
