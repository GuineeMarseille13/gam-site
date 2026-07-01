import Link from "next/link"
import { cn } from "@/helpers/utils"
import { buildAdminPageHref } from "@/app/(admin)/_shared/_lib/admin-pagination"
import type { DashboardAccessListCounts } from "@/app/(admin)/_shared/dashboard-access/_services/get-dashboard-access-list"
import type { AccessListStatusFilter } from "@/app/(admin)/_shared/dashboard-access/_schemas/access-list-search-params.schema"

const FILTERS: {
  id: AccessListStatusFilter
  label: string
  countKey: keyof DashboardAccessListCounts
}[] = [
  { id: "all", label: "Tous", countKey: "all" },
  { id: "active", label: "Actifs", countKey: "active" },
  { id: "banned", label: "Suspendus", countKey: "banned" },
]

interface BureauAccessListToolbarLinksProps {
  pathname: string
  status: AccessListStatusFilter
  counts: DashboardAccessListCounts
  searchParams: Record<string, string | string[] | undefined>
}

/**
 * Filtres de statut URL-based pour la liste des accès bureau.
 */
export function BureauAccessListToolbarLinks({
  pathname,
  status,
  counts,
  searchParams,
}: BureauAccessListToolbarLinksProps) {
  return (
    <div
      className="-mx-1 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-wrap sm:overflow-visible sm:pb-0"
      role="tablist"
      aria-label="Filtrer par statut"
    >
      {FILTERS.map(({ id, label, countKey }) => {
        const isActive = status === id
        const href = buildAdminPageHref(pathname, 1, {
          ...searchParams,
          statut: id === "all" ? undefined : id,
        })

        return (
          <Link
            key={id}
            href={href}
            scroll={false}
            role="tab"
            aria-selected={isActive}
            className={cn(
              "inline-flex h-8 items-center rounded-full border px-3.5 text-xs font-medium transition-colors",
              isActive
                ? "border-amber-500 bg-amber-500 text-white shadow-sm hover:bg-amber-600"
                : "border-border bg-background text-foreground hover:bg-muted/60",
            )}
          >
            {label}
            <span
              className={cn(
                "ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] tabular-nums",
                isActive ? "bg-white/20" : "bg-muted text-muted-foreground",
              )}
            >
              {counts[countKey]}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
