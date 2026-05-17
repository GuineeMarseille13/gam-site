"use client"

import type { AdministrationAccessRow } from "../_schemas/administration-access.schema"
import { cn } from "@/helpers/utils"
import { DashboardAccessStatusBadge } from "@/app/(admin)/bureau/acces/_components/dashboard-access-status-badge"
import { getAccessListGridClass } from "@/app/(admin)/bureau/acces/_components/dashboard-access-list-layout"
import { AdministrationAccessAccountCell } from "./administration-access-account-cell"
import { AdministrationAccessRowActions } from "./administration-access-row-actions"
import { getAdministrationAccessRoleLabel } from "./administration-access-role-label"
import { getAdministrationAccessDisplayName } from "./administration-access-utils"

interface AdministrationAccessDesktopRowProps {
  row: AdministrationAccessRow
  roleLabels: Record<string, string>
  isAdmin: boolean
  isSelf: boolean
  onBan: () => Promise<{ success: boolean; error?: string }>
  onUnban: () => Promise<{ success: boolean; error?: string }>
  onRevoke: () => Promise<{ success: boolean; error?: string }>
  onError: (message: string) => void
}

/**
 * Ligne tableau accès administration — viewport lg+.
 */
export function AdministrationAccessDesktopRow({
  row,
  roleLabels,
  isAdmin,
  isSelf,
  onBan,
  onUnban,
  onRevoke,
  onError,
}: AdministrationAccessDesktopRowProps) {
  const displayName = getAdministrationAccessDisplayName(row)
  const roleLabel = getAdministrationAccessRoleLabel(row.role, roleLabels)

  return (
    <article
      className={cn(
        "border-b border-border/50 px-5 py-4 transition-colors last:border-b-0 hover:bg-muted/20",
        row.banned && "bg-rose-50/15 dark:bg-rose-950/10",
        getAccessListGridClass(isAdmin),
      )}
    >
      <div className="flex min-w-0 items-center">
        <AdministrationAccessAccountCell row={row} avatarClassName="size-10" />
      </div>

      <div className="flex min-w-0 flex-col justify-center">
        <span className="inline-flex w-fit rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-900 ring-1 ring-inset ring-sky-200/80 dark:bg-sky-950/40 dark:text-sky-300 dark:ring-sky-800/40">
          {roleLabel}
        </span>
      </div>

      <div className="flex min-w-0 items-center">
        <DashboardAccessStatusBadge banned={row.banned} />
      </div>

      {isAdmin && (
        <div className="flex min-w-0 items-center justify-end overflow-visible">
          <AdministrationAccessRowActions
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
