"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/helpers/utils"
import {
  IconLoader2,
  IconTrash,
  IconX,
} from "@tabler/icons-react"

/** Sous le header bureau (z-20), au-dessus des cartes, sous les modales (z-50). */
const BULK_BAR_Z = "z-30"
const BULK_BAR_STICKY_TOP = "top-[var(--header-height)]"

interface EvenementsBulkToolbarProps {
  selectedCount: number
  totalCount: number
  isAllSelected: boolean
  isPending: boolean
  onToggleAll: () => void
  onCancel: () => void
  onDelete: () => void
  className?: string
}

/**
 * Barre d'actions sélection multiple — compacte, sticky seule sur cet élément.
 */
export function EvenementsBulkToolbar({
  selectedCount,
  totalCount,
  isAllSelected,
  isPending,
  onToggleAll,
  onCancel,
  onDelete,
  className,
}: EvenementsBulkToolbarProps) {
  const hasSelection = selectedCount > 0

  return (
    <div
      className={cn(
        "sticky flex w-full shrink-0 flex-wrap items-center gap-2 rounded-xl border border-slate-200/80 bg-background/95 px-3 py-2 shadow-sm backdrop-blur-sm supports-[backdrop-filter]:bg-background/80 sm:w-auto",
        BULK_BAR_STICKY_TOP,
        BULK_BAR_Z,
        className,
      )}
    >
      <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
        <Checkbox
          checked={isAllSelected}
          onCheckedChange={onToggleAll}
          disabled={isPending || totalCount === 0}
          aria-label={isAllSelected ? "Tout désélectionner" : "Tout sélectionner"}
        />
        <span className="hidden min-[480px]:inline">
          {isAllSelected ? "Tout désélectionner" : "Tout sélectionner"}
        </span>
      </label>

      <span className="text-sm text-slate-500 tabular-nums">
        {selectedCount} / {totalCount}
      </span>

      <div className="ml-auto flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={isPending}
          className="rounded-lg"
        >
          <IconX className="size-4" />
          Annuler
        </Button>

        <Button
          type="button"
          size="sm"
          onClick={onDelete}
          disabled={!hasSelection || isPending}
          className="rounded-lg bg-rose-600 text-white hover:bg-rose-700"
        >
          {isPending ? (
            <IconLoader2 className="size-4 animate-spin" />
          ) : (
            <IconTrash className="size-4" />
          )}
          Supprimer ({selectedCount})
        </Button>
      </div>
    </div>
  )
}
