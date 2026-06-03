"use client"

import { Eye, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/helpers/utils"
import type { BureauActivityReportRow } from "../_types/bureau-activity-report-row"

interface RapportsActiviteListItemProps {
  report: BureauActivityReportRow
  title: string
  switchId: string
  isBusy: boolean
  onPublishedChange: (id: string, isPublished: boolean) => void
  onRequestEdit: (r: BureauActivityReportRow) => void
  onRequestPreview: (r: BureauActivityReportRow) => void
  onRequestDelete: (r: BureauActivityReportRow) => void
}

/**
 * Ligne rapport (liste bureau) — mise en page mobile : infos puis barre d’actions sur une seule rangée.
 */
export function RapportsActiviteListItem({
  report,
  title,
  switchId,
  isBusy,
  onPublishedChange,
  onRequestEdit,
  onRequestPreview,
  onRequestDelete,
}: RapportsActiviteListItemProps) {
  const statusLabel = report.isPublished ? "Visible sur le site" : "Masqué sur le site"

  return (
    <div
      className={cn(
        "space-y-3 px-3 py-3 transition-colors sm:flex sm:items-center sm:justify-between sm:gap-6 sm:space-y-0 sm:px-6 sm:py-4",
        "hover:bg-muted/25",
        report.isPublished && "bg-primary/[0.03] hover:bg-primary/[0.06]",
      )}
    >
      <div className="flex min-w-0 items-start gap-2.5 sm:flex-1 sm:items-center sm:gap-4">
        <span
          className={cn(
            "inline-flex size-11 shrink-0 items-center justify-center rounded-xl text-sm font-semibold tabular-nums tracking-tight sm:size-auto sm:px-3 sm:py-1.5",
            "bg-muted/80 text-foreground ring-1 ring-border/60",
          )}
        >
          {report.year}
        </span>
        <div className="min-w-0 flex-1 space-y-0.5">
          <p className="line-clamp-2 font-medium text-foreground text-sm leading-snug sm:truncate sm:text-base">
            {title}
          </p>
          <p className="text-muted-foreground text-xs sm:text-sm">{statusLabel}</p>
        </div>
      </div>

      <div className="flex min-w-0 items-center justify-between gap-2 sm:shrink-0 sm:justify-end sm:gap-2.5">
        <div
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-full border border-border/60 bg-background/80 py-1 pl-2 pr-2.5 shadow-xs sm:gap-2 sm:px-3 sm:py-1.5",
            "dark:bg-background/40",
          )}
        >
          <Switch
            id={switchId}
            size="sm"
            checked={report.isPublished}
            disabled={isBusy}
            onCheckedChange={(checked) => onPublishedChange(report.id, checked)}
            aria-label={`Afficher sur le site public : ${title}`}
          />
          <Label
            htmlFor={switchId}
            className="cursor-pointer font-medium text-muted-foreground text-[11px] sm:text-sm"
          >
            <span className="sm:hidden">Public</span>
            <span className="hidden sm:inline">Site public</span>
          </Label>
        </div>

        <div
          className="flex shrink-0 items-center gap-0.5 rounded-xl border border-border/60 bg-muted/25 p-0.5 sm:gap-1 sm:border-0 sm:bg-transparent sm:p-0"
          role="group"
          aria-label={`Actions pour ${title}`}
        >
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="size-9 rounded-lg sm:size-8 sm:border sm:border-border/70 sm:bg-background sm:shadow-xs"
            onClick={() => onRequestEdit(report)}
            aria-label={`Modifier le rapport ${title}`}
          >
            <Pencil className="size-4" aria-hidden />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="size-9 rounded-lg sm:size-8 sm:border sm:border-border/70 sm:bg-background sm:shadow-xs"
            onClick={() => onRequestPreview(report)}
            aria-label={`Aperçu du rapport ${title}`}
          >
            <Eye className="size-4" aria-hidden />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="size-9 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive sm:size-8"
            onClick={() => onRequestDelete(report)}
            aria-label={`Supprimer le rapport ${title}`}
          >
            <Trash2 className="size-4" aria-hidden />
          </Button>
        </div>
      </div>
    </div>
  )
}
