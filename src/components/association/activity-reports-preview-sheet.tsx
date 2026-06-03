"use client"

import { useCallback, useId } from "react"
import { X } from "lucide-react"

import type { ActivityReportPublic } from "@/app/(public)/notre-association/_schemas/activity-report-public.schema"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/helpers/utils"

interface ActivityReportsPreviewSheetProps {
  report: ActivityReportPublic | null
  onOpenChange: (open: boolean) => void
  displayTitle: (r: ActivityReportPublic) => string
}

/**
 * Panneau latéral d’aperçu PDF pour les rapports d’activité (site public).
 */
export function ActivityReportsPreviewSheet({
  report,
  onOpenChange,
  displayTitle,
}: ActivityReportsPreviewSheetProps) {
  const baseId = useId()
  const handleOpenChange = useCallback(
    (open: boolean) => {
      onOpenChange(open)
    },
    [onOpenChange],
  )

  const title = report ? displayTitle(report) : ""

  return (
    <Sheet open={report !== null} onOpenChange={handleOpenChange}>
      <SheetContent
        showCloseButton={false}
        side="right"
        className={cn(
          "flex w-full max-w-full flex-col gap-0 border-l p-0 sm:max-w-2xl md:max-w-3xl",
          "data-[state=open]:duration-300",
        )}
      >
        {report ? (
          <>
            <SheetHeader className="flex flex-row items-start justify-between gap-3 border-border/50 border-b bg-gradient-to-r from-theme-green/[0.08] to-muted/20 px-5 py-4 pr-14 sm:px-6">
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-background px-2 py-0.5 font-semibold text-muted-foreground text-xs tabular-nums ring-1 ring-border/60">
                    {report.year}
                  </span>
                  <SheetTitle className="text-left text-base text-theme-green leading-snug sm:text-lg dark:text-theme-green-light">
                    {title}
                  </SheetTitle>
                </div>
                <SheetDescription id={`${baseId}-preview-desc`} className="text-left">
                  Aperçu du document dans le panneau ci-dessous.
                </SheetDescription>
              </div>
              <SheetClose asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="absolute top-3 right-3 shrink-0 rounded-full border border-border/50 bg-background/90 shadow-sm hover:border-theme-green/40 hover:bg-theme-green/10"
                  aria-label="Fermer l’aperçu"
                >
                  <X className="size-4" aria-hidden />
                </Button>
              </SheetClose>
            </SheetHeader>

            <div className="relative min-h-0 flex-1 bg-muted/30 p-4 sm:p-5">
              <div
                className={cn(
                  "relative overflow-hidden rounded-2xl border border-border/60 bg-background shadow-inner",
                  "min-h-[min(70vh,640px)] w-full ring-1 ring-black/[0.03] dark:ring-white/[0.04]",
                )}
              >
                <iframe
                  key={report.id}
                  src={`/api/report-activities/preview?reportId=${encodeURIComponent(report.id)}`}
                  title={title}
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                />
              </div>
            </div>

            <SheetFooter className="flex flex-row items-center justify-end gap-2 border-border/50 border-t bg-muted/10 px-4 py-3 sm:px-6">
              <SheetClose asChild>
                <Button
                  type="button"
                  size="sm"
                  className="rounded-lg bg-theme-green text-white hover:bg-theme-green-dark"
                >
                  Fermer
                </Button>
              </SheetClose>
            </SheetFooter>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
