"use client"

import { useCallback, useEffect, useId, useState } from "react"
import { Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { BureauActivityReportRow } from "../_types/bureau-activity-report-row"

interface RapportsActiviteEditDialogProps {
  report: BureauActivityReportRow | null
  open: boolean
  isPending: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (payload: { id: string; year: number; label: string; file: File | null }) => void
}

function defaultLabelForYear(year: number): string {
  return `Rapport d'activités ${year}`
}

/**
 * Dialogue de modification : année, titre affiché et remplacement optionnel du PDF.
 */
export function RapportsActiviteEditDialog({
  report,
  open,
  isPending,
  onOpenChange,
  onSubmit,
}: RapportsActiviteEditDialogProps) {
  const formId = useId()
  const [year, setYear] = useState(0)
  const [label, setLabel] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (!report || !open) return
    setYear(report.year)
    const trimmed = report.label?.trim()
    setLabel(trimmed && trimmed.length > 0 ? trimmed : defaultLabelForYear(report.year))
    setFile(null)
    setFormError(null)
  }, [report, open])

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setFormError(null)

      if (!report) return

      if (!Number.isFinite(year) || year < 2000 || year > 2100) {
        setFormError("L’année doit être comprise entre 2000 et 2100.")
        return
      }

      const trimmedLabel = label.trim()
      if (trimmedLabel.length === 0) {
        setFormError("Le titre affiché est obligatoire.")
        return
      }

      if (trimmedLabel.length > 200) {
        setFormError("Le titre affiché ne peut pas dépasser 200 caractères.")
        return
      }

      onSubmit({
        id: report.id,
        year,
        label: trimmedLabel,
        file,
      })
    },
    [file, label, onSubmit, report, year],
  )

  const displayTitle =
    report && (report.label?.trim() || defaultLabelForYear(report.year))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(92dvh,720px)] overflow-y-auto rounded-2xl p-4 sm:max-w-lg sm:p-6">
        <DialogHeader className="text-left">
          <DialogTitle className="text-base sm:text-lg">Modifier le rapport</DialogTitle>
          <DialogDescription className="text-left text-xs sm:text-sm">
            {displayTitle ? (
              <>
                <span className="sm:hidden">
                  Année, titre ou PDF pour « {displayTitle} ». Fichier vide = document conservé.
                </span>
                <span className="hidden sm:inline">
                  {`Mettez à jour l’année, le titre ou le fichier PDF de « ${displayTitle} ». Laissez le fichier vide pour conserver le document actuel.`}
                </span>
              </>
            ) : (
              "Mettez à jour l’année, le titre ou le fichier PDF."
            )}
          </DialogDescription>
        </DialogHeader>

        {report ? (
          <form id={formId} onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor={`${formId}-year`}>Année</Label>
                <Input
                  id={`${formId}-year`}
                  type="number"
                  min={2000}
                  max={2100}
                  value={year}
                  disabled={isPending}
                  onChange={(ev) => {
                    const v = Number(ev.target.value)
                    setYear(Number.isFinite(v) ? v : year)
                  }}
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor={`${formId}-label`}>Titre affiché</Label>
                <Input
                  id={`${formId}-label`}
                  placeholder="Ex. Rapport d'activités 2024"
                  required
                  value={label}
                  disabled={isPending}
                  onChange={(ev) => setLabel(ev.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={`${formId}-file`}>Remplacer le fichier (optionnel)</Label>
              <Input
                id={`${formId}-file`}
                type="file"
                accept="application/pdf,.pdf"
                className="cursor-pointer"
                disabled={isPending}
                onChange={(ev) => {
                  const next = ev.target.files?.[0] ?? null
                  setFile(next)
                }}
              />
              <p className="text-muted-foreground text-xs">
                PDF uniquement, 15 Mo maximum. Un nouveau fichier remplace l’ancien sur Cloudinary.
              </p>
            </div>

            {formError ? (
              <p className="text-sm text-destructive" role="alert">
                {formError}
              </p>
            ) : null}

            <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                className="w-full sm:w-auto"
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="w-full gap-1.5 bg-amber-500 hover:bg-amber-600 sm:w-auto"
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    Enregistrement…
                  </>
                ) : (
                  <>
                    <span className="sm:hidden">Enregistrer</span>
                    <span className="hidden sm:inline">Enregistrer les modifications</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
