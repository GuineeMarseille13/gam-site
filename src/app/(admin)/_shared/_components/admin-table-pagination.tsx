import Link from "next/link"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"
import { cn } from "@/helpers/utils"
import { ADMIN_TABLE_PAGE_SIZE } from "../_schemas/pagination.schema"
import { buildAdminPageHref } from "../_lib/admin-pagination"

interface AdminTablePaginationProps {
  pathname: string
  total: number
  page: number
  pageSize?: number
  searchParams?: Record<string, string | string[] | undefined>
  pageParam?: string
  className?: string
}

function getVisiblePages(current: number, totalPages: number): number[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages = new Set<number>([1, totalPages, current])
  if (current > 1) pages.add(current - 1)
  if (current < totalPages) pages.add(current + 1)

  return [...pages].sort((a, b) => a - b)
}

/**
 * Pagination URL-based pour les tableaux admin (RSC-friendly, sans JS client).
 */
export function AdminTablePagination({
  pathname,
  total,
  page,
  pageSize = ADMIN_TABLE_PAGE_SIZE,
  searchParams = {},
  pageParam = "page",
  className,
}: AdminTablePaginationProps) {
  if (total <= pageSize) return null

  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * pageSize + 1
  const end = Math.min(safePage * pageSize, total)
  const visiblePages = getVisiblePages(safePage, totalPages)

  const prevHref =
    safePage > 1
      ? buildAdminPageHref(pathname, safePage - 1, searchParams, pageParam)
      : null
  const nextHref =
    safePage < totalPages
      ? buildAdminPageHref(pathname, safePage + 1, searchParams, pageParam)
      : null

  return (
    <nav
      aria-label="Pagination du tableau"
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <p className="text-center text-xs text-muted-foreground sm:text-left">
        <span className="font-medium text-foreground">
          {start}–{end}
        </span>{" "}
        sur{" "}
        <span className="font-medium text-foreground">{total}</span> résultat
        {total > 1 ? "s" : ""}
      </p>

      <div className="flex items-center justify-center gap-1">
        {prevHref ? (
          <Link
            href={prevHref}
            className="inline-flex size-9 items-center justify-center rounded-xl border border-border/60 bg-background text-foreground transition-colors hover:bg-muted/60"
            aria-label="Page précédente"
          >
            <IconChevronLeft className="size-4" aria-hidden />
          </Link>
        ) : (
          <span
            className="inline-flex size-9 items-center justify-center rounded-xl border border-border/30 bg-muted/20 text-muted-foreground/40"
            aria-hidden
          >
            <IconChevronLeft className="size-4" />
          </span>
        )}

        <div className="hidden items-center gap-0.5 sm:flex">
          {visiblePages.map((pageNumber, index) => {
            const prevNumber = visiblePages[index - 1]
            const showEllipsis = prevNumber !== undefined && pageNumber - prevNumber > 1

            return (
              <span key={pageNumber} className="flex items-center gap-0.5">
                {showEllipsis && (
                  <span className="px-1.5 text-xs text-muted-foreground" aria-hidden>
                    …
                  </span>
                )}
                <Link
                  href={buildAdminPageHref(
                    pathname,
                    pageNumber,
                    searchParams,
                    pageParam,
                  )}
                  aria-label={`Page ${pageNumber}`}
                  aria-current={pageNumber === safePage ? "page" : undefined}
                  className={cn(
                    "inline-flex min-w-9 items-center justify-center rounded-xl px-2.5 py-2 text-xs font-semibold tabular-nums transition-colors",
                    pageNumber === safePage
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "border border-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  {pageNumber}
                </Link>
              </span>
            )
          })}
        </div>

        <span className="px-2 text-xs font-medium tabular-nums text-muted-foreground sm:hidden">
          {safePage} / {totalPages}
        </span>

        {nextHref ? (
          <Link
            href={nextHref}
            className="inline-flex size-9 items-center justify-center rounded-xl border border-border/60 bg-background text-foreground transition-colors hover:bg-muted/60"
            aria-label="Page suivante"
          >
            <IconChevronRight className="size-4" aria-hidden />
          </Link>
        ) : (
          <span
            className="inline-flex size-9 items-center justify-center rounded-xl border border-border/30 bg-muted/20 text-muted-foreground/40"
            aria-hidden
          >
            <IconChevronRight className="size-4" />
          </span>
        )}
      </div>
    </nav>
  )
}
