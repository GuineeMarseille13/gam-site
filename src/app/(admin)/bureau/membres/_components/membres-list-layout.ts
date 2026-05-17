import { cn } from "@/helpers/utils"

/**
 * Grilles alignées en-tête / lignes — évite les colonnes fantômes quand une cellule est masquée.
 * mobile : une colonne (métadonnées sous le libellé principal)
 * sm+    : trois colonnes explicites
 */
export const MEMBRES_THREE_COL_GRID =
  "grid grid-cols-[minmax(0,1fr)] items-center gap-x-4 gap-y-2 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]"

export const MEMBRES_TABLE_WRAPPER =
  "overflow-x-auto rounded-2xl border bg-card shadow-sm [-webkit-overflow-scrolling:touch]"

export const MEMBRES_TABLE_HEADER = cn(
  MEMBRES_THREE_COL_GRID,
  "min-w-[min(100%,20rem)] border-b bg-muted/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground sm:min-w-[28rem] sm:px-5",
)

export const MEMBRES_TABLE_ROW = cn(
  MEMBRES_THREE_COL_GRID,
  "min-w-[min(100%,20rem)] px-4 py-3.5 transition-colors hover:bg-muted/20 sm:min-w-[28rem] sm:px-5 sm:py-4",
)

/** Cartes statistiques (vue « Tous »). */
export const MEMBRES_STATS_GRID =
  "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
