"use client"

import { useCallback, useMemo, useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { IconCalendarX, IconChecklist, IconLoader2, IconTrash } from "@tabler/icons-react"
import { deleteEvenement, deleteEvenementsBulk } from "../_actions/actions"
import type { EvenementListItem } from "../_types/evenement-list-item"
import { EventFilter, type EventFilterValue } from "./event-filter"
import { EvenementCard } from "./evenement-card"
import { EvenementsBulkToolbar } from "./evenements-bulk-toolbar"

/**
 * Shell admin (référence) : main z-0 · header sticky z-20 · barre bulk mobile z-30 · modales z-50.
 * Carte : voir `Z` dans evenement-card.tsx (empilement local isolate).
 */
const TIME_CFG = {
  upcoming: {
    accent: "border-t-blue-500",
    card: "bg-white hover:shadow-lg hover:shadow-blue-500/5 hover:border-blue-200/70",
    label: "À venir",
    badge: "bg-blue-50 text-blue-700 border-blue-200/50",
    dateCls: "text-blue-600 font-medium",
    titleCls: "font-semibold text-slate-900",
  },
  past: {
    accent: "border-t-slate-200",
    card: "bg-white hover:shadow-lg hover:border-slate-200/80",
    label: "Passé",
    badge: "bg-slate-100 text-slate-600 border-slate-200/50",
    dateCls: "text-slate-500",
    titleCls: "font-medium text-slate-800",
  },
} as const

function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return "—"
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date)
}

interface EvenementsListProps {
  evenements: EvenementListItem[]
  counts: Record<EventFilterValue, number>
  activeFilter: EventFilterValue
}

/**
 * Liste événements avec sélection multiple et suppression groupée.
 */
export function EvenementsList({
  evenements,
  counts,
  activeFilter,
}: EvenementsListProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())
  const [openBulkDelete, setOpenBulkDelete] = useState(false)

  const now = useMemo(() => new Date(), [])
  const visibleIds = useMemo(() => evenements.map((e) => e.id), [evenements])
  const selectedCount = selectedIds.size
  const isAllSelected =
    evenements.length > 0 && selectedCount === evenements.length

  const exitSelectionMode = useCallback(() => {
    setSelectionMode(false)
    setSelectedIds(new Set())
    setOpenBulkDelete(false)
  }, [])

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const toggleSelectAll = useCallback(() => {
    setSelectedIds((prev) => {
      if (prev.size === evenements.length) return new Set()
      return new Set(visibleIds)
    })
  }, [evenements.length, visibleIds])

  const confirmBulkDelete = useCallback(() => {
    const ids = [...selectedIds]
    setOpenBulkDelete(false)

    startTransition(async () => {
      const result = await deleteEvenementsBulk({ ids })
      if (result.success) {
        toast.success(
          `${result.deletedCount} événement${result.deletedCount > 1 ? "s" : ""} supprimé${result.deletedCount > 1 ? "s" : ""}`,
        )
        exitSelectionMode()
        router.refresh()
        return
      }

      toast.error("La suppression a échoué. Réessayez.")
    })
  }, [selectedIds, exitSelectionMode, router])

  if (evenements.length === 0) {
    return (
      <div className="space-y-3 sm:space-y-4">
        {counts.ALL > 0 && (
          <EventFilter counts={counts} current={activeFilter} />
        )}
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-16 sm:py-20 text-slate-500">
          <div className="flex size-14 items-center justify-center rounded-xl bg-slate-100 ring-1 ring-slate-200/40">
            <IconCalendarX className="size-8 text-slate-400" />
          </div>
          <p className="text-sm font-medium">
            {activeFilter === "ALL"
              ? "Aucun événement enregistré"
              : "Aucun événement dans cette catégorie"}
          </p>
          {activeFilter === "ALL" && (
            <Link
              href="/bureau/evenements/nouveau"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Créer le premier événement
            </Link>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Parent barre + grille : requis pour position:sticky sur tout le scroll */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <EventFilter counts={counts} current={activeFilter} />

          {selectionMode ? (
            <EvenementsBulkToolbar
              selectedCount={selectedCount}
              totalCount={evenements.length}
              isAllSelected={isAllSelected}
              isPending={isPending}
              onToggleAll={toggleSelectAll}
              onCancel={exitSelectionMode}
              onDelete={() => setOpenBulkDelete(true)}
            />
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSelectionMode(true)}
              className="w-full shrink-0 rounded-xl border-slate-200 sm:w-auto"
            >
              <IconChecklist className="size-4" />
              Sélectionner
            </Button>
          )}
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
        {evenements.map((event) => {
          const isUpcoming = new Date(event.startDate) > now
          const cfg = isUpcoming ? TIME_CFG.upcoming : TIME_CFG.past

          return (
            <EvenementCard
              key={event.id}
              event={event}
              timeConfig={cfg}
              formattedDate={formatDate(event.startDate)}
              selectionMode={selectionMode}
              isSelected={selectedIds.has(event.id)}
              onToggleSelect={() => toggleSelect(event.id)}
              onDelete={deleteEvenement.bind(null, event.id)}
            />
          )
        })}
        </ul>
      </div>

      <AlertDialog open={openBulkDelete} onOpenChange={setOpenBulkDelete}>
        <AlertDialogContent className="max-w-sm gap-0 overflow-hidden p-0">
          <div className="flex flex-col items-center gap-3 bg-rose-50/60 px-8 pb-6 pt-8 dark:bg-rose-950/20">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-rose-100 ring-4 ring-rose-100/60">
              <IconTrash className="size-6 text-rose-600" />
            </div>
            <AlertDialogTitle className="text-base font-semibold text-foreground">
              Supprimer {selectedCount} événement{selectedCount > 1 ? "s" : ""} ?
            </AlertDialogTitle>
          </div>
          <div className="px-8 py-5">
            <AlertDialogDescription className="text-center text-sm text-muted-foreground">
              Cette action est{" "}
              <span className="font-medium text-foreground">irréversible</span>.
              Les événements et leurs médias seront définitivement supprimés.
            </AlertDialogDescription>
          </div>
          <AlertDialogFooter className="flex-row gap-2 border-t px-8 py-5">
            <AlertDialogCancel className="flex-1 rounded-xl" disabled={isPending}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white"
              onClick={confirmBulkDelete}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <IconLoader2 className="size-4 animate-spin" />
                  Suppression…
                </>
              ) : (
                <>
                  <IconTrash className="size-4" />
                  Supprimer
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
