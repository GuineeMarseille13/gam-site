"use client"

import { cn } from "@/helpers/utils"
import type { DashboardAccessScope } from "@/config/dashboard-access-scope"
import { getDashboardAccessAccentClasses } from "@/config/dashboard-access-accent-theme"
import { DashboardAccessStatusBadge } from "@/app/(admin)/bureau/acces/_components/dashboard-access-status-badge"
import { getAccessListGridClass } from "@/app/(admin)/bureau/acces/_components/dashboard-access-list-layout"
import type { DashboardAccessRow } from "../_types/dashboard-access-row"
import { DashboardAccessAccountCell } from "./dashboard-access-account-cell"
import { DashboardAccessRowActions } from "./dashboard-access-row-actions"
import { getDashboardAccessRoleLabel } from "./dashboard-access-role-label"
import { getDashboardAccessDisplayName } from "./dashboard-access-utils"

interface DashboardAccessDesktopRowProps {
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
 * Ligne tableau accès dashboard — viewport lg+.
 */
export function DashboardAccessDesktopRow({
  scope,
  row,
  roleLabels,
  isAdmin,
  isSelf,
  onBan,
  onUnban,
  onRevoke,
  onError,
}: DashboardAccessDesktopRowProps) {
  const accent = getDashboardAccessAccentClasses(scope)
  const displayName = getDashboardAccessDisplayName(row)
  const roleLabel = getDashboardAccessRoleLabel(row.role, roleLabels)

  return (
    <article
      className={cn(
        "border-b border-border/50 px-5 py-4 transition-colors last:border-b-0 hover:bg-muted/20",
        row.banned && "bg-rose-50/15 dark:bg-rose-950/10",
        getAccessListGridClass(isAdmin),
      )}
    >
      <div className="flex min-w-0 items-center">
        <DashboardAccessAccountCell scope={scope} row={row} avatarClassName="size-10" />
      </div>

      <div className="flex min-w-0 flex-col justify-center">
        <span
          className={cn(
            "inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset",
            accent.badge,
          )}
        >
          {roleLabel}
        </span>
      </div>

      <div className="flex min-w-0 items-center">
        <DashboardAccessStatusBadge banned={row.banned} />
      </div>

      {isAdmin && (
        <div className="flex min-w-0 items-center justify-end overflow-visible">
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
        </div>
      )}
    </article>
  )
}
