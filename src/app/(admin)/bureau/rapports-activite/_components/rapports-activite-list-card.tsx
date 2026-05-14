"use client"

import { useCallback, useId, useState } from "react"
import Link from "next/link"
import { Eye, Trash2, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
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

interface RapportsActiviteListCardProps {
  reports: BureauActivityReportRow[]
  displayTitle: (r: BureauActivityReportRow) => string
  busyVisibilityId: string | null
  onPublishedChange: (id: string, isPublished: boolean) => void
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
      <Card className="lg:col-span-1 overflow-hidden rounded-2xl border-border/60 shadow-sm">
        <CardHeader className="border-border/50 border-b bg-muted/15 px-5 py-4 sm:px-6">
          <CardTitle className="text-lg font-semibold tracking-tight">Rapports en ligne</CardTitle>
          <CardDescription className="text-pretty leading-relaxed">
            Le commutateur contrôle l’affichage sur « Notre association » (onglet Rapport d’activité). Les entrées
            masquées restent disponibles ici. Utilisez l’icône œil pour prévisualiser le document.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {reports.length === 0 ? (
            <p className="px-5 py-12 text-center text-muted-foreground text-sm sm:px-6">
              Aucun rapport enregistré pour le moment.
            </p>
          ) : (
            <ul className="divide-border/50 divide-y" role="list">
              {reports.map((r) => {
                const switchId = `${baseId}-vis-${r.id}`
                const isBusy = busyVisibilityId === r.id
                const title = displayTitle(r)

                return (
                  <li key={r.id}>
                    <div
                      className={cn(
                        "flex flex-col gap-4 px-4 py-4 transition-colors sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 sm:py-4",
                        "hover:bg-muted/25",
                        r.isPublished && "bg-primary/[0.03] hover:bg-primary/[0.06]",
                      )}
                    >
                      <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center sm:gap-4">
                        <span
                          className={cn(
                            "inline-flex shrink-0 items-center justify-center rounded-xl px-3 py-1.5 text-sm font-semibold tabular-nums tracking-tight",
                            "bg-muted/80 text-foreground ring-1 ring-border/60",
                          )}
                        >
                          {r.year}
                        </span>
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <p className="truncate font-medium text-foreground text-sm leading-snug sm:text-base">
                            {title}
                          </p>
                          <p className="text-muted-foreground text-xs sm:text-sm">
                            {r.isPublished ? "Visible sur le site" : "Masqué sur le site"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 sm:shrink-0 sm:justify-end sm:gap-2.5">
                        <div
                          className={cn(
                            "flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1.5 shadow-xs",
                            "dark:bg-background/40",
                          )}
                        >
                          <Switch
                            id={switchId}
                            size="sm"
                            checked={r.isPublished}
                            disabled={isBusy}
                            onCheckedChange={(checked) => onPublishedChange(r.id, checked)}
                            aria-label={`Afficher sur le site public : ${title}`}
                          />
                          <Label
                            htmlFor={switchId}
                            className="cursor-pointer text-muted-foreground text-xs font-medium sm:text-sm"
                          >
                            Site public
                          </Label>
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          size="icon-sm"
                          className="rounded-xl border-border/70 shadow-xs"
                          onClick={() => handleOpenPreview(r)}
                          aria-label={`Aperçu du rapport ${title}`}
                        >
                          <Eye className="size-4" aria-hidden />
                        </Button>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => onRequestDelete(r)}
                          aria-label={`Supprimer le rapport ${title}`}
                        >
                          <Trash2 className="size-4" aria-hidden />
                        </Button>
                      </div>
                    </div>
                  </li>
                )
              })}
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
              <SheetHeader className="flex flex-row items-start justify-between gap-3 border-border/50 border-b bg-muted/20 px-5 py-4 pr-14 sm:px-6">
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-background px-2 py-0.5 font-semibold text-muted-foreground text-xs tabular-nums ring-1 ring-border/60">
                      {preview.year}
                    </span>
                    <SheetTitle className="text-left text-base leading-snug sm:text-lg">
                      {previewTitle}
                    </SheetTitle>
                  </div>
                  <SheetDescription id={`${baseId}-preview-desc`} className="text-left">
                    Aperçu du rapport.
                  </SheetDescription>
                </div>
                <SheetClose asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="absolute top-3 right-3 shrink-0 rounded-lg"
                    aria-label="Fermer l’aperçu"
                  >
                    <X className="size-4" aria-hidden />
                  </Button>
                </SheetClose>
              </SheetHeader>

              <div className="relative min-h-0 flex-1 bg-muted/30 p-4 sm:p-5">
                <div
                  className={cn(
                    "relative overflow-hidden rounded-xl border border-border/60 bg-background shadow-inner",
                    "min-h-[min(70vh,640px)] w-full",
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

              <SheetFooter className="flex flex-row flex-wrap items-center justify-between gap-2 border-border/50 border-t bg-muted/10 px-4 py-3 sm:px-6">
                <Button asChild variant="outline" size="sm" className="rounded-lg">
                  <Link href={preview.pdfUrl} target="_blank" rel="noopener noreferrer">
                    Ouvrir dans un nouvel onglet
                  </Link>
                </Button>
                <SheetClose asChild>
                  <Button type="button" variant="secondary" size="sm" className="rounded-lg">
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
