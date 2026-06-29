"use client"

import { useCallback, useEffect, useId, useState } from "react"
import { createPortal } from "react-dom"
import { Download, X } from "lucide-react"

import type { ActivityReportPublic } from "@/app/(public)/notre-association/_schemas/activity-report-public.schema"
import { ActivityReportPdfViewer } from "@/components/association/activity-report-pdf-viewer"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { activityReportPdfFilename } from "@/lib/activity-report-pdf-filename"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/helpers/utils"

interface ActivityReportsPreviewSheetProps {
  report: ActivityReportPublic | null
  onOpenChange: (open: boolean) => void
  displayTitle: (r: ActivityReportPublic) => string
}

interface PreviewPanelProps {
  report: ActivityReportPublic
  title: string
  titleId: string
  descriptionId: string
  previewSrc: string
  downloadSrc: string
  downloadFilename: string
  onClose: () => void
  layout: "mobile" | "desktop"
}

/**
 * Pied de panneau avec action de fermeture.
 */
function ActivityReportPreviewFooter({
  onClose,
  fullWidth = false,
}: {
  onClose: () => void
  fullWidth?: boolean
}) {
  return (
    <footer className="flex shrink-0 flex-row items-center justify-end gap-2 border-border/50 border-t bg-muted/10 px-4 py-3 sm:px-6">
      <Button
        type="button"
        size="sm"
        onClick={onClose}
        className={cn(
          "rounded-lg bg-theme-green text-white hover:bg-theme-green-dark",
          fullWidth && "w-full",
        )}
      >
        Fermer
      </Button>
    </footer>
  )
}

/**
 * En-tête + zone scrollable partagés entre l’aperçu mobile (portal) et desktop (sheet).
 */
function ActivityReportPreviewPanel({
  report,
  title,
  titleId,
  descriptionId,
  previewSrc,
  downloadSrc,
  downloadFilename,
  onClose,
  layout,
}: PreviewPanelProps) {
  const isMobileLayout = layout === "mobile"
  const actionButtonClassName = cn(
    "shrink-0 rounded-full border border-border/50 bg-background/90 shadow-sm",
    "hover:border-theme-green/40 hover:bg-theme-green/10",
  )

  return (
    <>
      <header
        className={cn(
          "relative shrink-0 border-border/50 border-b bg-gradient-to-r from-theme-green/[0.08] to-muted/20",
          isMobileLayout ? "px-4 py-3.5 pr-[5.5rem]" : "px-5 py-4 pr-[5.5rem] sm:px-6",
        )}
      >
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-background px-2 py-0.5 font-semibold text-muted-foreground text-xs tabular-nums ring-1 ring-border/60">
              {report.year}
            </span>
            <h2
              id={titleId}
              className={cn(
                "text-left font-semibold text-theme-green leading-snug dark:text-theme-green-light",
                isMobileLayout ? "text-base" : "text-base sm:text-lg",
              )}
            >
              {title}
            </h2>
          </div>
          <p id={descriptionId} className="text-left text-muted-foreground text-sm">
            Faites défiler pour parcourir le document ou téléchargez-le.
          </p>
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <Button
            asChild
            variant="ghost"
            size="icon-sm"
            className={actionButtonClassName}
          >
            <a
              href={downloadSrc}
              download={downloadFilename}
              aria-label={`Télécharger le document : ${title}`}
            >
              <Download className="size-4" aria-hidden />
            </a>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={actionButtonClassName}
            onClick={onClose}
            aria-label="Fermer l’aperçu"
          >
            <X className="size-4" aria-hidden />
          </Button>
        </div>
      </header>

      <div
        className={cn(
          "min-h-0 flex-1 overflow-y-auto overscroll-y-contain bg-muted/30 touch-pan-y",
          "[-webkit-overflow-scrolling:touch]",
          isMobileLayout ? "p-2" : "p-3 sm:p-5",
        )}
      >
        <ActivityReportPdfViewer src={previewSrc} title={title} />
      </div>
    </>
  )
}

/**
 * Panneau d’aperçu PDF pour les rapports d’activité (site public).
 * Mobile : overlay plein écran avec scroll natif. Desktop : sheet latéral.
 */
export function ActivityReportsPreviewSheet({
  report,
  onOpenChange,
  displayTitle,
}: ActivityReportsPreviewSheetProps) {
  const baseId = useId()
  const isMobile = useIsMobile()
  const [mounted, setMounted] = useState(false)

  const isOpen = report !== null
  const title = report ? displayTitle(report) : ""
  const previewSrc = report
    ? `/api/report-activities/preview?reportId=${encodeURIComponent(report.id)}`
    : null
  const downloadSrc = report
    ? `/api/report-activities/download?reportId=${encodeURIComponent(report.id)}`
    : null
  const downloadFilename = report ? activityReportPdfFilename(report.year) : ""
  const descriptionId = `${baseId}-preview-desc`
  const titleId = `${baseId}-preview-title`

  const handleOpenChange = useCallback(
    (open: boolean) => {
      onOpenChange(open)
    },
    [onOpenChange],
  )

  const handleClose = useCallback(() => {
    handleOpenChange(false)
  }, [handleOpenChange])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !isMobile || !isOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") handleClose()
    }

    window.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [mounted, isMobile, isOpen, handleClose])

  const useMobileOverlay = mounted && isMobile

  if (useMobileOverlay && isOpen && report && previewSrc && downloadSrc) {
    return createPortal(
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-background"
      >
        <ActivityReportPreviewPanel
          report={report}
          title={title}
          titleId={titleId}
          descriptionId={descriptionId}
          previewSrc={previewSrc}
          downloadSrc={downloadSrc}
          downloadFilename={downloadFilename}
          onClose={handleClose}
          layout="mobile"
        />
        <ActivityReportPreviewFooter onClose={handleClose} fullWidth />
      </div>,
      document.body,
    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        showCloseButton={false}
        side="right"
        onOpenAutoFocus={(event) => event.preventDefault()}
        className={cn(
          "flex h-full min-h-0 w-full max-w-full flex-col gap-0 overflow-hidden border-l p-0 sm:max-w-2xl md:max-w-3xl",
          "data-[state=open]:duration-300",
        )}
      >
        {report && previewSrc && downloadSrc ? (
          <>
            <SheetHeader className="sr-only">
              <SheetTitle>{title}</SheetTitle>
              <SheetDescription>
                Faites défiler pour parcourir le document ou téléchargez-le.
              </SheetDescription>
            </SheetHeader>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <ActivityReportPreviewPanel
                report={report}
                title={title}
                titleId={titleId}
                descriptionId={descriptionId}
                previewSrc={previewSrc}
                downloadSrc={downloadSrc}
                downloadFilename={downloadFilename}
                onClose={handleClose}
                layout="desktop"
              />
            </div>

            <ActivityReportPreviewFooter onClose={handleClose} />
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
