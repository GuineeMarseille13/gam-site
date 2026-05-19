"use client"

import { cn } from "@/helpers/utils"
import type { DashboardAccessScope } from "@/config/dashboard-access-scope"
import { getDashboardAccessAccentClasses } from "@/config/dashboard-access-accent-theme"
import { DashboardAccessStatusBadge } from "@/app/(admin)/bureau/acces/_components/dashboard-access-status-badge"
import type { DashboardAccessRow } from "../_types/dashboard-access-row"
import { DashboardAccessAccountCell } from "./dashboard-access-account-cell"
import { DashboardAccessRowActions } from "./dashboard-access-row-actions"
import { getDashboardAccessRoleLabel } from "./dashboard-access-role-label"
import { getDashboardAccessDisplayName } from "./dashboard-access-utils"

interface DashboardAccessMobileCardProps {
  scope: DashboardAccessScope
  row: DashboardAccessRow
  roleLabels: Record<string, string>
  isAdmin: boolean
  isSelf: boolean
  onBan: () => Promise<{ success: boolean; error?: string }>
  onUnban: () => Promise<{ success: boolean; error?: string }>
  onRevoke: () => Promise<{ success: boolean; error?: string }>
  onError: (message: string) => void
}

/**
 * Carte accès dashboard — viewport &lt; lg.
 */
export function DashboardAccessMobileCard({
  scope,
  row,
  roleLabels,
  isAdmin,
  isSelf,
  onBan,
  onUnban,
  onRevoke,
  onError,
}: DashboardAccessMobileCardProps) {
  const accent = getDashboardAccessAccentClasses(scope)
  const displayName = getDashboardAccessDisplayName(row)
  const roleLabel = getDashboardAccessRoleLabel(row.role, roleLabels)

  return (
    <article
      className={cn(
        "overflow-hidden rounded-2xl border border-border/70 bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5",
        row.banned && "border-rose-200/60 bg-rose-50/25 dark:border-rose-900/40 dark:bg-rose-950/15",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <DashboardAccessAccountCell scope={scope} row={row} />
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <DashboardAccessStatusBadge banned={row.banned} />
          {isAdmin && (
            <DashboardAccessRowActions
              scope={scope}
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
        <span
          className={cn(
            "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset",
            accent.badge,
          )}
        >
          {roleLabel}
        </span>
      </div>
    </article>
  )
}
