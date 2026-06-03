"use client"

import { useCallback, useId, useState } from "react"
import { X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import type { BureauActivityReportRow } from "../_types/bureau-activity-report-row"
import { RapportsActiviteListItem } from "./rapports-activite-list-item"

interface RapportsActiviteListCardProps {
  reports: BureauActivityReportRow[]
  displayTitle: (r: BureauActivityReportRow) => string
  busyVisibilityId: string | null
  onPublishedChange: (id: string, isPublished: boolean) => void
  onRequestEdit: (r: BureauActivityReportRow) => void
  onRequestDelete: (r: BureauActivityReportRow) => void
}

/**
 * Liste des rapports avec visibilité site public, aperçu dans un panneau latéral et suppression.
 */
export function RapportsActiviteListCard({
  reports,
  displayTitle,
  busyVisibilityId,
  onPublishedChange,
  onRequestEdit,
  onRequestDelete,
}: RapportsActiviteListCardProps) {
  const baseId = useId()
  const [preview, setPreview] = useState<BureauActivityReportRow | null>(null)

  const handleOpenPreview = useCallback((r: BureauActivityReportRow) => {
    setPreview(r)
  }, [])

  const handleSheetOpenChange = useCallback((open: boolean) => {
    if (!open) setPreview(null)
  }, [])

  const previewTitle = preview ? displayTitle(preview) : ""

  return (
    <>
      <Card className="overflow-hidden rounded-2xl border-border/60 shadow-sm lg:col-span-1">
        <CardHeader className="border-border/50 border-b bg-muted/15 px-4 py-3.5 sm:px-6 sm:py-4">
          <CardTitle className="text-base font-semibold tracking-tight sm:text-lg">
            Rapports en ligne
          </CardTitle>
          <CardDescription className="text-pretty text-xs leading-relaxed sm:text-sm">
            <span className="sm:hidden">
              Commutateur = visibilité sur le site. Crayon = modifier, œil = aperçu PDF.
            </span>
            <span className="hidden sm:inline">
              Le commutateur contrôle l’affichage sur « Notre association » (onglet Rapport d’activité). Les entrées
              masquées restent disponibles ici. Modifiez une ligne via le crayon ; l’icône œil ouvre l’aperçu du PDF.
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {reports.length === 0 ? (
            <p className="px-4 py-10 text-center text-muted-foreground text-sm sm:px-6 sm:py-12">
              Aucun rapport enregistré pour le moment.
            </p>
          ) : (
            <ul className="divide-border/50 divide-y" role="list">
              {reports.map((r) => (
                <li key={r.id}>
                  <RapportsActiviteListItem
                    report={r}
                    title={displayTitle(r)}
                    switchId={`${baseId}-vis-${r.id}`}
                    isBusy={busyVisibilityId === r.id}
                    onPublishedChange={onPublishedChange}
                    onRequestEdit={onRequestEdit}
                    onRequestPreview={handleOpenPreview}
                    onRequestDelete={onRequestDelete}
                  />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Sheet open={preview !== null} onOpenChange={handleSheetOpenChange}>
        <SheetContent
          showCloseButton={false}
          side="right"
          className={cn(
            "flex w-full max-w-full flex-col gap-0 border-l p-0 sm:max-w-2xl md:max-w-3xl",
            "data-[state=open]:duration-300",
          )}
        >
          {preview ? (
            <>
              <SheetHeader className="flex flex-row items-start justify-between gap-2 border-border/50 border-b bg-muted/20 px-4 py-3 pr-12 sm:gap-3 sm:px-6 sm:py-4 sm:pr-14">
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-background px-2 py-0.5 font-semibold text-muted-foreground text-xs tabular-nums ring-1 ring-border/60">
                      {preview.year}
                    </span>
                    <SheetTitle className="line-clamp-2 text-left text-sm leading-snug sm:text-lg">
                      {previewTitle}
                    </SheetTitle>
                  </div>
                  <SheetDescription id={`${baseId}-preview-desc`} className="text-left text-xs sm:text-sm">
                    Aperçu du rapport.
                  </SheetDescription>
                </div>
                <SheetClose asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="absolute top-2.5 right-2.5 shrink-0 rounded-lg sm:top-3 sm:right-3"
                    aria-label="Fermer l’aperçu"
                  >
                    <X className="size-4" aria-hidden />
                  </Button>
                </SheetClose>
              </SheetHeader>

              <div className="relative min-h-0 flex-1 bg-muted/30 p-3 sm:p-5">
                <div
                  className={cn(
                    "relative overflow-hidden rounded-xl border border-border/60 bg-background shadow-inner",
                    "min-h-[min(72dvh,640px)] w-full sm:min-h-[min(70vh,640px)]",
                  )}
                >
                  <iframe
                    key={preview.id}
                    src={`/api/bureau/rapports-activite/preview?reportId=${encodeURIComponent(preview.id)}`}
                    title={previewTitle}
                    className="absolute inset-0 h-full w-full border-0"
                    loading="lazy"
                  />
                </div>
              </div>

              <SheetFooter className="flex flex-row items-center justify-end gap-2 border-border/50 border-t bg-muted/10 px-4 py-3 sm:px-6">
                <SheetClose asChild>
                  <Button type="button" variant="secondary" size="sm" className="w-full rounded-lg sm:w-auto">
                    Fermer
                  </Button>
                </SheetClose>
              </SheetFooter>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </>
  )
}
