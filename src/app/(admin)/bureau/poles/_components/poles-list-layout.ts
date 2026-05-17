import { cn } from "@/helpers/utils"

/**
 * Grille pôles : nom (+ image) | description | actions.
 * mobile : nom + description sous le titre, menu ⋮
 * sm+    : trois colonnes explicites
 * lg+    : colonne actions en largeur fixe
 */
export const POLES_LIST_ROW_GRID = cn(
  "grid items-center gap-x-4 gap-y-2",
  "grid-cols-[minmax(0,1fr)_auto]",
  "sm:grid-cols-[minmax(0,2fr)_minmax(0,2fr)_auto]",
  "lg:grid-cols-[minmax(0,2fr)_minmax(0,2fr)_13.5rem]",
)

export const POLES_LIST_WRAPPER =
  "overflow-hidden rounded-2xl border bg-card shadow-sm"

export const POLES_LIST_HEADER = cn(
  POLES_LIST_ROW_GRID,
  "border-b bg-muted/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground sm:px-5",
)

export const POLES_LIST_ROW = cn(
  POLES_LIST_ROW_GRID,
  "px-4 py-3.5 transition-colors hover:bg-muted/20 sm:px-5 sm:py-4",
)
