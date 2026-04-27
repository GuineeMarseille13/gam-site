import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { AdherentListRow } from "@/lib/schemas/adherent-list.schema"
import { formatShortDate } from "../_utils/adherent-list-filters"
import { IconMail, IconPhone } from "@tabler/icons-react"

interface AdherentsRowsProps {
  rows: AdherentListRow[]
}

export function AdherentsRows({ rows }: AdherentsRowsProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-border bg-muted/30 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground sm:grid-cols-[2fr_1fr_auto] lg:grid-cols-[2fr_1fr_1fr_220px]">
        <span>Adhérent</span>
        <span className="hidden sm:block">Téléphone</span>
        <span className="hidden lg:block">Email</span>
        <span className="hidden text-right lg:block">Cotisation</span>
      </div>

      <div className="divide-y divide-border/60">
        {rows.map((row) => {
          const ini = `${row.firstName?.[0] ?? ""}${row.lastName?.[0] ?? ""}`.toUpperCase() || "?"
          const name = `${row.firstName} ${row.lastName}`

          return (
            <div
              key={row.personId}
              className="group grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-3.5 transition-colors hover:bg-muted/20 sm:grid-cols-[2fr_1fr_auto] lg:grid-cols-[2fr_1fr_1fr_220px]"
            >
              <div className="flex min-w-0 items-center gap-3.5">
                <Avatar className="size-9 shrink-0 ring-2 ring-border/40">
                  <AvatarImage src={row.image ?? ""} alt={name} className="object-cover" />
                  <AvatarFallback className="bg-gradient-to-br from-amber-100 to-amber-200 text-xs font-bold text-amber-900 dark:from-amber-900/40 dark:to-amber-800/40 dark:text-amber-100">
                    {ini}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{name}</p>
                  {row.phone && (
                    <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground sm:hidden">
                      <IconPhone className="size-3 shrink-0" />
                      {row.phone}
                    </p>
                  )}
                  {row.email && (
                    <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground lg:hidden">
                      <IconMail className="size-3 shrink-0" />
                      {row.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="hidden items-center gap-1.5 text-sm sm:flex">
                <IconPhone className="size-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate text-foreground/80">{row.phone || "—"}</span>
              </div>

              <div className="hidden items-center gap-1.5 text-sm lg:flex">
                {row.email ? (
                  <>
                    <IconMail className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate text-foreground/80">{row.email}</span>
                  </>
                ) : (
                  <span className="text-muted-foreground/40">—</span>
                )}
              </div>

              <div className="flex flex-col items-end gap-1 text-right">
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <span className="text-sm font-semibold tabular-nums text-foreground">{row.latestYear}</span>
                  <Badge variant="secondary" className="font-normal tabular-nums">
                    {row.membershipCount} paiement{row.membershipCount > 1 ? "s" : ""}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <Badge
                    variant="outline"
                    className={
                      row.hasActiveMembership
                        ? "border-emerald-200 bg-emerald-100 text-emerald-800"
                        : "border-border bg-muted text-muted-foreground"
                    }
                  >
                    {row.hasActiveMembership ? "Active" : "Inactive"}
                  </Badge>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {formatShortDate(row.latestMembershipCreatedAt)}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
