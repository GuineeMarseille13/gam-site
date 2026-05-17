"use client"

import type { DashboardAccessRow } from "../_schemas/dashboard-access.schema"
import { cn } from "@/helpers/utils"
import { DashboardAccessAccountCell } from "./dashboard-access-account-cell"
import { DashboardAccessRowActions } from "./dashboard-access-row-actions"
import { DashboardAccessStatusBadge } from "./dashboard-access-status-badge"
import { getDashboardAccessRoleLabel } from "./dashboard-access-role-label"
import { getAccessListGridClass } from "./dashboard-access-list-layout"
import { getAccessDisplayName } from "./dashboard-access-utils"

interface DashboardAccessDesktopRowProps {
  row: DashboardAccessRow
  isAdmin: boolean
  isSelf: boolean
  onBan: () => Promise<{ success: boolean; error?: string }>
  onUnban: () => Promise<{ success: boolean; error?: string }>
  onRevoke: () => Promise<{ success: boolean; error?: string }>
  onError: (message: string) => void
}

/**
 * Ligne tableau accès dashboard — viewport lg+.
 */
export function DashboardAccessDesktopRow({
  row,
  isAdmin,
  isSelf,
  onBan,
  onUnban,
  onRevoke,
  onError,
}: DashboardAccessDesktopRowProps) {
  const displayName = getAccessDisplayName(row)
  const roleLabel = getDashboardAccessRoleLabel(row.role)

  return (
    <article
      className={cn(
        "border-b border-border/50 px-5 py-4 transition-colors last:border-b-0 hover:bg-muted/20",
        row.banned && "bg-rose-50/15 dark:bg-rose-950/10",
        getAccessListGridClass(isAdmin),
      )}
    >
      <div className="flex min-w-0 items-center">
        <DashboardAccessAccountCell row={row} avatarClassName="size-10" />
      </div>

      <div className="flex min-w-0 flex-col justify-center">
        <span className="inline-flex w-fit rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900 ring-1 ring-inset ring-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-800/40">
          {roleLabel}
        </span>
      </div>

      <div className="flex min-w-0 items-center">
        <DashboardAccessStatusBadge banned={row.banned} />
      </div>

      {isAdmin && (
        <div className="flex min-w-0 items-center justify-end overflow-visible">
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
        </div>
      )}
    </article>
  )
}
