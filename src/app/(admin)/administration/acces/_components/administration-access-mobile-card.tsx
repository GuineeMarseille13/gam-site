"use client"

import type { AdministrationAccessRow } from "../_schemas/administration-access.schema"
import { cn } from "@/helpers/utils"
import { DashboardAccessStatusBadge } from "@/app/(admin)/bureau/acces/_components/dashboard-access-status-badge"
import { AdministrationAccessAccountCell } from "./administration-access-account-cell"
import { AdministrationAccessRowActions } from "./administration-access-row-actions"
import { getAdministrationAccessDisplayName } from "./administration-access-utils"
import { getAdministrationAccessRoleLabel } from "./administration-access-role-label"

interface AdministrationAccessMobileCardProps {
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
 * Carte accès administration — viewport &lt; lg.
 */
export function AdministrationAccessMobileCard({
  row,
  roleLabels,
  isAdmin,
  isSelf,
  onBan,
  onUnban,
  onRevoke,
  onError,
}: AdministrationAccessMobileCardProps) {
  const displayName = getAdministrationAccessDisplayName(row)
  const roleLabel = getAdministrationAccessRoleLabel(row.role, roleLabels)

  return (
    <article
      className={cn(
        "overflow-hidden rounded-2xl border border-border/70 bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5",
        row.banned && "border-rose-200/60 bg-rose-50/25 dark:border-rose-900/40 dark:bg-rose-950/15",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <AdministrationAccessAccountCell row={row} />
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <DashboardAccessStatusBadge banned={row.banned} />
          {isAdmin && (
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
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border/40 pt-3">
        <span className="inline-flex rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-medium text-sky-900 ring-1 ring-inset ring-sky-200/80 dark:bg-sky-950/40 dark:text-sky-300 dark:ring-sky-800/40">
          {roleLabel}
        </span>
      </div>
    </article>
  )
}
