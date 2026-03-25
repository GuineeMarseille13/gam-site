"use client"

import { useCallback, useState, useTransition } from "react"
import { format, parseISO } from "date-fns"
import { fr } from "date-fns/locale"
import { Eye, Loader2 } from "lucide-react"

import { loadPermanenceVolunteerYearDetail } from "../../_actions/get-permanence-volunteer-year-detail"
import type {
  PermanenceVolunteerAnnualHoursRow,
  PermanenceVolunteerYearDetailRow,
} from "../../_schemas/permanence-hours-annual-stats.schema"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface PermanenceAnnualHoursResultsProps {
  year: number
  rows: PermanenceVolunteerAnnualHoursRow[]
}

function formatHours(value: number): string {
  if (Number.isInteger(value)) return String(value)
  return value.toFixed(1).replace(".", ",")
}

/**
 * Tableau desktop + cartes mobile : heures annuelles par membre, avec détail par Sheet.
 */
export function PermanenceAnnualHoursResults({ year, rows }: PermanenceAnnualHoursResultsProps) {
  const grandTotal = rows.reduce((sum, r) => sum + r.totalHours, 0)

  const [sheetOpen, setSheetOpen] = useState(false)
  const [detailMember, setDetailMember] = useState<string | null>(null)
  const [detailRows, setDetailRows] = useState<PermanenceVolunteerYearDetailRow[]>([])
  const [detailError, setDetailError] = useState<string | null>(null)
  const [detailPending, startDetailTransition] = useTransition()

  const openDetail = useCallback(
    (memberFullName: string) => {
      setDetailMember(memberFullName)
      setDetailError(null)
      setDetailRows([])
      setSheetOpen(true)
      startDetailTransition(async () => {
        const res = await loadPermanenceVolunteerYearDetail({ year, memberFullName })
        if (res.success) {
          setDetailRows(res.rows)
          return
        }
        setDetailError(res.error)
      })
    },
    [year],
  )

  const handleSheetOpenChange = useCallback((open: boolean) => {
    setSheetOpen(open)
    if (!open) {
      setDetailMember(null)
      setDetailRows([])
      setDetailError(null)
    }
  }, [])

  const detailSubtotal = detailRows.reduce((s, r) => s + r.hours, 0)

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 px-4 py-12 text-center">
        <p className="text-sm font-medium text-foreground">Aucune saisie pour {year}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Les heures apparaissent lorsque des présences sont enregistrées sur l’année sélectionnée.
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Mobile : cartes */}
      <ul className="grid min-w-0 gap-3 md:hidden">
        {rows.map((row) => (
          <li key={row.memberFullName}>
            <Card className="border-border/70 shadow-sm">
              <CardContent className="flex flex-col gap-3 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <span className="min-w-0 text-sm font-semibold leading-snug text-foreground break-words">
                    {row.memberFullName}
                  </span>
                  <span className="shrink-0 text-2xl font-bold tabular-nums text-sky-700 dark:text-sky-400">
                    {formatHours(row.totalHours)} h
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-11 w-full gap-2 border-sky-200/80 bg-background hover:border-sky-400 hover:bg-sky-50 hover:text-foreground sm:h-9 dark:border-sky-800/70 dark:hover:border-sky-500 dark:hover:bg-sky-950/55 dark:hover:text-sky-50"
                  onClick={() => openDetail(row.memberFullName)}
                >
                  <Eye className="size-4 shrink-0" aria-hidden />
                  Voir le détail des journées
                </Button>
              </CardContent>
            </Card>
          </li>
        ))}
        <li>
          <Card className="border-sky-200/60 bg-sky-50/40 dark:border-sky-900/50 dark:bg-sky-950/25">
            <CardContent className="flex flex-row items-center justify-between gap-3 p-4">
              <span className="text-sm font-semibold text-foreground">Total annuel</span>
              <span className="text-xl font-bold tabular-nums text-sky-800 dark:text-sky-300">
                {formatHours(grandTotal)} h
              </span>
            </CardContent>
          </Card>
        </li>
      </ul>

      {/* Desktop : tableau */}
      <div className="hidden overflow-x-auto rounded-xl border border-border/80 md:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="min-w-[180px]">Membre</TableHead>
              <TableHead className="w-32 text-right">Heures ({year})</TableHead>
              <TableHead className="w-[140px] text-right">
                <span className="sr-only">Actions</span>
                <span aria-hidden className="not-sr-only text-muted-foreground">
                  Détail
                </span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.memberFullName}
                className="hover:bg-sky-50/60 dark:hover:bg-sky-950/30"
              >
                <TableCell className="font-medium break-words">{row.memberFullName}</TableCell>
                <TableCell className="text-right tabular-nums text-base">
                  {formatHours(row.totalHours)} h
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1.5 border-sky-200/80 bg-background hover:border-sky-400 hover:bg-sky-50 hover:text-foreground dark:border-sky-800/70 dark:hover:border-sky-500 dark:hover:bg-sky-950/55 dark:hover:text-sky-50"
                    onClick={() => openDetail(row.memberFullName)}
                  >
                    <Eye className="size-4" aria-hidden />
                    Détail
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableCell className="font-semibold">Total</TableCell>
              <TableCell className="text-right text-base font-bold tabular-nums">
                {formatHours(grandTotal)} h
              </TableCell>
              <TableCell />
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      <Sheet open={sheetOpen} onOpenChange={handleSheetOpenChange}>
        <SheetContent
          side="right"
          className="flex h-full !w-full flex-col gap-0 overflow-hidden p-0 sm:!max-w-lg"
        >
          <SheetHeader className="shrink-0 space-y-1 border-b border-border/80 px-4 py-4 text-left">
            <SheetTitle className="pr-10 text-lg leading-snug">
              Détail des permanences
              {detailMember ? (
                <>
                  <span className="block text-base font-normal text-muted-foreground">
                    {detailMember}
                  </span>
                  <span className="text-sm font-normal text-muted-foreground">Année {year}</span>
                </>
              ) : null}
            </SheetTitle>
            <SheetDescription className="text-left">
              Chaque ligne correspond à une saisie (date de permanence, durée, commentaire).
            </SheetDescription>
          </SheetHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
            {detailPending && (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
                <Loader2 className="size-8 animate-spin" aria-hidden />
                <p className="text-sm">Chargement…</p>
              </div>
            )}

            {!detailPending && detailError && (
              <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {detailError}
              </p>
            )}

            {!detailPending && !detailError && detailRows.length === 0 && detailMember && (
              <p className="text-sm text-muted-foreground">Aucune saisie à afficher.</p>
            )}

            {!detailPending && !detailError && detailRows.length > 0 && (
              <ul className="flex flex-col gap-0 divide-y divide-border/80">
                {detailRows.map((r) => (
                  <li key={r.id} className="py-4 first:pt-0">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground">
                        {format(parseISO(r.permanenceDate), "EEEE d MMMM yyyy", { locale: fr })}
                      </p>
                      <p className="text-lg font-bold tabular-nums text-sky-700 dark:text-sky-400">
                        {formatHours(r.hours)} h
                      </p>
                    </div>
                    {r.comment ? (
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground break-words">
                        {r.comment}
                      </p>
                    ) : null}
                    <p className="mt-2 text-xs text-muted-foreground">
                      Saisi le{" "}
                      {format(parseISO(r.createdAt), "d MMM yyyy à HH:mm", { locale: fr })}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {!detailPending && !detailError && detailRows.length > 0 && (
            <div className="shrink-0 border-t border-border/80 bg-muted/30 px-4 py-3">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-semibold text-foreground">Sous-total ({year})</span>
                <span className="text-lg font-bold tabular-nums text-foreground">
                  {formatHours(detailSubtotal)} h
                </span>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
