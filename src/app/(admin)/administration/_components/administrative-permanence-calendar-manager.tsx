"use client"

import { useCallback, useEffect, useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { format, parseISO } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar as CalendarLucide, Loader2, Pencil, Plus, Trash2 } from "lucide-react"

import {
  deleteAdministrativePermanenceSlotAction,
  saveAdministrativePermanenceSettingsAction,
  seedDefaultAdministrativePermanenceSlotsAction,
} from "../_actions/manage-administrative-permanence"
import { AdministrativePermanenceSlotDialog } from "./administrative-permanence-slot-dialog"
import type { AdministrativePermanenceSlotRow } from "@/helpers/administrative-permanence/administrative-permanence.schema"
import { formatSlotRangeFr } from "@/helpers/administrative-permanence/format-hm-fr"
import {
  administrationCardClassName,
  administrationIconBadgeClassName,
  administrationMutedSurfaceClassName,
  administrationOutlineButtonClassName,
  administrationPrimaryButtonClassName,
} from "@/config/administration-dashboard-theme"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/helpers/utils"

interface AdministrativePermanenceCalendarManagerProps {
  className?: string
  initialSlots: AdministrativePermanenceSlotRow[]
  initialHorairesCardText: string | null
}

/**
 * Configuration du calendrier des permanences (pôle administratif) — synchronisé avec le site.
 */
export function AdministrativePermanenceCalendarManager({
  className,
  initialSlots,
  initialHorairesCardText,
}: AdministrativePermanenceCalendarManagerProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [slots, setSlots] = useState(initialSlots)
  const [horairesText, setHorairesText] = useState(initialHorairesCardText ?? "")
  const [settingsError, setSettingsError] = useState<string | null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<AdministrativePermanenceSlotRow | null>(null)
  const [deleteDate, setDeleteDate] = useState<string | null>(null)

  const years = useMemo(() => {
    const ys = new Set<number>()
    for (const s of slots) {
      ys.add(new Date(s.date).getFullYear())
    }
    ys.add(new Date().getFullYear())
    ys.add(new Date().getFullYear() + 1)
    return [...ys].sort((a, b) => a - b)
  }, [slots])

  const [yearFilter, setYearFilter] = useState(() => {
    const y = new Date().getFullYear()
    return y
  })

  const filtered = useMemo(
    () => slots.filter((s) => new Date(s.date).getFullYear() === yearFilter),
    [slots, yearFilter],
  )

  const byMonth = useMemo(() => {
    const m = new Map<string, AdministrativePermanenceSlotRow[]>()
    for (const row of filtered) {
      const key = format(parseISO(row.date), "yyyy-MM")
      const prev = m.get(key) ?? []
      prev.push(row)
      m.set(key, prev)
    }
    for (const arr of m.values()) {
      arr.sort((a, b) => a.date.localeCompare(b.date))
    }
    return [...m.entries()].sort(([a], [b]) => a.localeCompare(b))
  }, [filtered])

  const refresh = useCallback(() => {
    router.refresh()
  }, [router])

  const handleSaved = useCallback(() => {
    refresh()
  }, [refresh])

  const openCreate = useCallback(() => {
    setEditing(null)
    setDialogOpen(true)
  }, [])

  const openEdit = useCallback((row: AdministrativePermanenceSlotRow) => {
    setEditing(row)
    setDialogOpen(true)
  }, [])

  const handleDelete = useCallback(() => {
    if (!deleteDate) return
    startTransition(async () => {
      const res = await deleteAdministrativePermanenceSlotAction({ date: deleteDate })
      if (!res.success) {
        return
      }
      setDeleteDate(null)
      refresh()
    })
  }, [deleteDate, refresh])

  useEffect(() => {
    setSlots(initialSlots)
  }, [initialSlots])

  useEffect(() => {
    setHorairesText(initialHorairesCardText ?? "")
  }, [initialHorairesCardText])

  const handleSaveSettings = useCallback(() => {
    setSettingsError(null)
    startTransition(async () => {
      const res = await saveAdministrativePermanenceSettingsAction({
        horairesCardText: horairesText.trim() === "" ? null : horairesText.trim(),
      })
      if (!res.success) {
        setSettingsError(res.error)
        return
      }
      refresh()
    })
  }, [horairesText, refresh])

  const handleSeed = useCallback(() => {
    startTransition(async () => {
      const res = await seedDefaultAdministrativePermanenceSlotsAction()
      if (!res.success) {
        return
      }
      refresh()
    })
  }, [refresh])

  return (
    <div className={cn("flex flex-col gap-10", className)}>
      <Card className={cn(administrationCardClassName, "overflow-hidden")}>
        <CardHeader className="space-y-1">
          <div
            className={cn(
              "flex size-10 items-center justify-center rounded-xl",
              administrationIconBadgeClassName,
            )}
          >
            <CalendarLucide className="size-5" aria-hidden />
          </div>
          <CardTitle className="text-xl">Texte « Horaires » sur le site</CardTitle>
          <CardDescription>
            Optionnel : remplace le texte automatique dans l’encadré vert au-dessus du calendrier.
            Laissez vide pour générer un résumé selon les créneaux.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Label htmlFor="horaires-card" className="sr-only">
            Texte horaires
          </Label>
          <Textarea
            id="horaires-card"
            value={horairesText}
            onChange={(e) => setHorairesText(e.target.value)}
            placeholder="Ex. Permanences de 14h à 16h (jours indiqués au calendrier)."
            rows={3}
            className="min-h-[88px] resize-y border-border/80"
          />
          {settingsError ? (
            <p className="text-sm text-destructive" role="alert">
              {settingsError}
            </p>
          ) : null}
          <Button
            type="button"
            className={administrationPrimaryButtonClassName}
            onClick={handleSaveSettings}
            disabled={pending}
          >
            {pending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
                Enregistrement…
              </>
            ) : (
              "Enregistrer le texte"
            )}
          </Button>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <Label htmlFor="year-filter" className="text-sm font-medium">
            Année
          </Label>
          <Select
            value={String(yearFilter)}
            onValueChange={(v) => setYearFilter(Number.parseInt(v, 10))}
          >
            <SelectTrigger id="year-filter" className="h-10 w-[120px] border-border/80">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className={administrationOutlineButtonClassName}
            onClick={handleSeed}
            disabled={pending}
          >
            Importer le calendrier 2026 par défaut
          </Button>
          <Button
            type="button"
            className={administrationPrimaryButtonClassName}
            onClick={openCreate}
          >
            <Plus className="mr-2 size-4" aria-hidden />
            Ajouter une permanence
          </Button>
        </div>
      </div>

      {byMonth.length === 0 ? (
        <div
          className={cn(
            administrationMutedSurfaceClassName,
            "rounded-xl border border-dashed border-border/80 p-8 text-center text-sm text-muted-foreground",
          )}
        >
          Aucune date pour {yearFilter}. Ajoutez un créneau ou importez le calendrier par défaut.
        </div>
      ) : (
        <div className="grid gap-6">
          {byMonth.map(([monthKey, rows]) => {
            const label = format(parseISO(`${monthKey}-01T12:00:00`), "MMMM yyyy", {
              locale: fr,
            })
            return (
              <section key={monthKey} aria-labelledby={`month-${monthKey}`}>
                <h2
                  id={`month-${monthKey}`}
                  className="mb-3 flex items-center gap-2 text-lg font-semibold capitalize tracking-tight text-foreground"
                >
                  <span
                    className="inline-block h-7 w-1.5 shrink-0 rounded-full bg-[var(--admin-primary)]"
                    aria-hidden
                  />
                  {label}
                </h2>
                <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {rows.map((row) => (
                    <li
                      key={row.id}
                      className={cn(
                        administrationCardClassName,
                        "flex flex-col gap-3 rounded-xl p-4 transition-shadow hover:shadow-md",
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            {format(parseISO(`${row.date}T12:00:00`), "EEEE", { locale: fr })}
                          </p>
                          <p className="text-lg font-bold tabular-nums text-foreground">
                            {format(parseISO(`${row.date}T12:00:00`), "d MMMM", {
                              locale: fr,
                            })}
                          </p>
                          <p className="mt-1 text-sm font-medium text-[var(--admin-primary)]">
                            {formatSlotRangeFr(row.startTime, row.endTime)}
                          </p>
                        </div>
                        <div className="flex shrink-0 gap-1">
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="size-9 text-muted-foreground hover:text-foreground"
                            onClick={() => openEdit(row)}
                            aria-label="Modifier"
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="size-9 text-destructive hover:text-destructive"
                            onClick={() => setDeleteDate(row.date)}
                            aria-label="Supprimer"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
        </div>
      )}

      <AdministrativePermanenceSlotDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={editing}
        onSaved={handleSaved}
      />

      <AlertDialog open={deleteDate != null} onOpenChange={() => setDeleteDate(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette permanence ?</AlertDialogTitle>
            <AlertDialogDescription>
              La date sera retirée du site public immédiatement après confirmation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={pending}
            >
              {pending ? <Loader2 className="size-4 animate-spin" /> : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
