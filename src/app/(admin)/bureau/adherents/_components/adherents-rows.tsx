import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { AdherentListRow } from "@/lib/schemas/adherent-list.schema"
import { IconListDetails, IconMail, IconPhone } from "@tabler/icons-react"

interface AdherentsRowsProps {
  rows: AdherentListRow[]
  /** Si défini, colonnes Année / Statut reflètent cette cotisation uniquement */
  yearFilter: number | null
  onOpenDetail: (personId: string) => void
}

function displayYear(row: AdherentListRow, yearFilter: number | null): number {
  return yearFilter ?? row.latestYear
}

function displayIsActive(row: AdherentListRow, yearFilter: number | null): boolean {
  if (yearFilter === null) return row.hasActiveMembership
  const snap = row.membershipsByYear.find((m) => m.year === yearFilter)
  return snap?.isActive ?? false
}

export function AdherentsRows({ rows, yearFilter, onOpenDetail }: AdherentsRowsProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border/50 bg-card/60 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.35)] ring-1 ring-white/[0.04] backdrop-blur-sm dark:bg-card/40 dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.65)]">
      <div className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-border/40 bg-gradient-to-r from-muted/60 via-muted/30 to-transparent px-4 py-3 sm:grid-cols-[2fr_1fr_auto] sm:gap-4 sm:px-6 sm:py-3.5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_7rem_9rem_auto]">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Adhérent
        </span>
        <span className="hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:block">
          Téléphone
        </span>
        <span className="hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground lg:block">
          Email
        </span>
        <span className="hidden text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground lg:block">
          Année
        </span>
        <span className="hidden text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground lg:block">
          Statut
        </span>
        <span className="hidden text-right text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground lg:block">
          Actions
        </span>
      </div>

      <div className="divide-y divide-border/30">
        {rows.map((row) => {
          const ini = `${row.firstName?.[0] ?? ""}${row.lastName?.[0] ?? ""}`.toUpperCase() || "?"
          const name = `${row.firstName} ${row.lastName}`
          const activeForDisplay = displayIsActive(row, yearFilter)
          const yearForDisplay = displayYear(row, yearFilter)

          const statusBadge = (
            <Badge
              variant="outline"
              className={
                activeForDisplay
                  ? "rounded-full border-emerald-500/40 bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-300"
                  : "rounded-full border-border/60 bg-muted/40 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
              }
            >
              {activeForDisplay ? "Active" : "Inactive"}
            </Badge>
          )

          const yearCell = (
            <span className="tabular-nums text-sm font-bold text-foreground sm:text-[15px] lg:flex lg:items-center lg:justify-center lg:text-base">
              {yearForDisplay}
            </span>
          )

          const detailButton = (
            <Button
              type="button"
              size="sm"
              className="h-9 w-full shrink-0 gap-1.5 rounded-full border-0 bg-gradient-to-r from-amber-500 to-amber-600 px-3.5 text-xs font-semibold text-white shadow-md shadow-amber-900/25 transition hover:from-amber-400 hover:to-amber-500 hover:shadow-lg hover:shadow-amber-900/30 focus-visible:ring-2 focus-visible:ring-amber-400/50 dark:shadow-black/40 sm:w-auto lg:justify-self-end"
              onClick={() => onOpenDetail(row.personId)}
              aria-label={`Voir le détail de ${name}`}
            >
              <IconListDetails className="size-4 shrink-0 opacity-95" aria-hidden />
              <span className="hidden sm:inline">Détails</span>
            </Button>
          )

          return (
            <div
              key={row.personId}
              className="group relative grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-4 transition-all duration-200 sm:grid-cols-[2fr_1fr_auto] sm:gap-4 sm:px-6 sm:py-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_7rem_9rem_auto] lg:hover:bg-gradient-to-r lg:hover:from-amber-500/[0.06] lg:hover:to-transparent"
            >
              <div className="pointer-events-none absolute inset-y-2 left-0 w-0.5 rounded-full bg-amber-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100 max-lg:hidden" />

              <div className="flex min-w-0 items-center gap-3.5 sm:gap-4">
                <Avatar className="size-10 shrink-0 ring-2 ring-border/50 transition-transform duration-200 group-hover:ring-amber-500/35 sm:size-11">
                  <AvatarImage src={row.image ?? ""} alt={name} className="object-cover" />
                  <AvatarFallback className="bg-gradient-to-br from-amber-400/90 to-amber-600/90 text-xs font-bold text-white shadow-inner dark:from-amber-600/80 dark:to-amber-800/90">
                    {ini}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold tracking-tight text-foreground sm:text-[15px]">
                    {name}
                  </p>
                  {row.phone && (
                    <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground sm:hidden">
                      <IconPhone className="size-3 shrink-0 opacity-70" />
                      {row.phone}
                    </p>
                  )}
                  {row.email && (
                    <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground lg:hidden">
                      <IconMail className="size-3 shrink-0 opacity-70" />
                      {row.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="hidden items-center gap-2 text-sm sm:flex">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground">
                  <IconPhone className="size-3.5" aria-hidden />
                </span>
                <span className="truncate text-foreground/90">{row.phone || "—"}</span>
              </div>

              <div className="hidden items-center gap-2 text-sm lg:flex">
                {row.email ? (
                  <>
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground">
                      <IconMail className="size-3.5" aria-hidden />
                    </span>
                    <span className="truncate text-foreground/90">{row.email}</span>
                  </>
                ) : (
                  <span className="text-muted-foreground/35">—</span>
                )}
              </div>

              <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-3 lg:contents">
                {yearCell}
                <div className="flex items-center justify-end lg:justify-center">{statusBadge}</div>
                {detailButton}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
