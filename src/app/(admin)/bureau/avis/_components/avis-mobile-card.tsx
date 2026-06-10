import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { RowActions } from "@/components/bureau/row-actions"
import { deleteAvis } from "../_actions/actions"
import { AvisAvatarWithStatus } from "./avis-avatar-with-status"
import { ReviewSourceLine } from "@/components/review-source-line"
import type { AvisListRow } from "../_types/avis-list-row"

function siteBadgeClass(isActive: boolean) {
  return isActive
    ? "border-emerald-200/80 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/45 dark:text-emerald-300"
    : "border-border bg-muted/80 text-muted-foreground"
}

function verifiedBadgeClass(isVerified: boolean) {
  return isVerified
    ? "border-sky-200/80 bg-sky-50 text-sky-900 dark:border-sky-900/40 dark:bg-sky-950/40 dark:text-sky-200"
    : "border-amber-200/60 bg-amber-50/90 text-amber-900 dark:border-amber-900/35 dark:bg-amber-950/30 dark:text-amber-200"
}

interface AvisMobileCardProps {
  row: AvisListRow
}

/**
 * Carte avis (viewport mobile) — mise en page lisible, hiérarchie claire, alignée au thème bureau.
 */
export function AvisMobileCard({ row: r }: AvisMobileCardProps) {
  const name = `${r.firstName} ${r.lastName}`.trim()

  return (
    <Card className="group overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-shadow duration-200 hover:shadow-md">
      <CardContent className="p-4 sm:p-5">
        <div className="flex gap-3 sm:gap-4">
          <AvisAvatarWithStatus
            size="md"
            firstName={r.firstName}
            lastName={r.lastName}
            avatarUrl={r.avatarUrl}
            isActive={r.isActive}
          />
          <div className="min-w-0 flex-1 space-y-2.5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <h3 className="text-xl font-semibold leading-tight tracking-tight text-foreground sm:text-[1.05rem]">
                  {name}
                </h3>
                <ReviewSourceLine
                  sourceLabel={r.sourceLabel}
                  sourceImageUrl={r.sourceImageUrl}
                />
                <p className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-muted-foreground sm:text-sm">
                  <span className="tabular-nums">
                    <span className="font-semibold text-foreground">{r.rating}</span>
                    <span>/5</span>
                  </span>
                  <span aria-hidden className="text-border">
                    ·
                  </span>
                  <span className="tabular-nums">Ordre {r.order}</span>
                </p>
              </div>
              <RowActions
                editHref={`/bureau/avis/${r.id}/modifier`}
                onDelete={deleteAvis.bind(null, r.id)}
              />
            </div>

            <div className="flex flex-wrap gap-2 border-t border-border/40 pt-3">
              <Badge
                variant="outline"
                className={`rounded-lg px-2.5 py-0.5 text-xs font-medium ${siteBadgeClass(r.isActive)}`}
              >
                {r.isActive ? "Visible sur le site" : "Masqué"}
              </Badge>
              <Badge
                variant="outline"
                className={`rounded-lg px-2.5 py-0.5 text-xs font-medium ${verifiedBadgeClass(r.isVerified)}`}
              >
                {r.isVerified ? "Validé" : "À valider"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
