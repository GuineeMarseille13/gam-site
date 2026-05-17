"use client"

import type { DashboardAccessRow } from "../_schemas/dashboard-access.schema"
import { cn } from "@/helpers/utils"
import { DashboardAccessAccountCell } from "./dashboard-access-account-cell"
import { DashboardAccessRowActions } from "./dashboard-access-row-actions"
import { DashboardAccessStatusBadge } from "./dashboard-access-status-badge"
import { getAccessDisplayName } from "./dashboard-access-utils"
import { getDashboardAccessRoleLabel } from "./dashboard-access-role-label"

interface DashboardAccessMobileCardProps {
  row: DashboardAccessRow
  isAdmin: boolean
  isSelf: boolean
  onBan: () => Promise<{ success: boolean; error?: string }>
  onUnban: () => Promise<{ success: boolean; error?: string }>
  onRevoke: () => Promise<{ success: boolean; error?: string }>
  onError: (message: string) => void
}

/**
 * Carte accès dashboard — viewport &lt; lg (alignée sur avis / adhésions).
 */
export function DashboardAccessMobileCard({
  row,
  isAdmin,
  isSelf,
  onBan,
  onUnban,
  onRevoke,
  onError,
}: DashboardAccessMobileCardProps) {
  const displayName = getAccessDisplayName(row)
  const roleLabel = getDashboardAccessRoleLabel(row.role)

  return (
    <article
      className={cn(
        "overflow-hidden rounded-2xl border border-border/70 bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5",
        row.banned && "border-rose-200/60 bg-rose-50/25 dark:border-rose-900/40 dark:bg-rose-950/15",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <DashboardAccessAccountCell row={row} />
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <DashboardAccessStatusBadge banned={row.banned} />
          {isAdmin && (
            <DashboardAccessRowActions
              userId={row.userId}
              displayName={displayName}
              banned={row.banned}
              canManage={isAdmin}
              isSelf={isSelf}
              onBan={onBan}
              onUnban={onUnban}
              onRevoke={onRevoke}
              onError={onError}
            />
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border/40 pt-3">
        <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-medium text-amber-900 ring-1 ring-inset ring-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-800/40">
          {roleLabel}
        </span>
      </div>
    </article>
  )
}
