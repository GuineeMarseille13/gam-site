import { cn } from "@/helpers/utils"

/**
 * Grille desktop partagée en-tête / lignes.
 * Colonne actions en largeur fixe pour éviter le décalage entre les rangées.
 */
const ACCESS_LIST_GRID_COLS_ADMIN =
  "lg:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)_minmax(5.5rem,0.9fr)_15.5rem]"

const ACCESS_LIST_GRID_COLS_VIEW =
  "lg:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)_minmax(5.5rem,0.9fr)]"

const ACCESS_LIST_GRID_BASE = "lg:grid lg:items-center lg:gap-x-4"

/** Classes grille desktop pour une ligne (avec colonne actions). */
export const ACCESS_LIST_ROW_GRID_ADMIN = cn(
  ACCESS_LIST_GRID_BASE,
  ACCESS_LIST_GRID_COLS_ADMIN,
)

/** Classes grille desktop pour une ligne (lecture seule). */
export const ACCESS_LIST_ROW_GRID_VIEW = cn(ACCESS_LIST_GRID_BASE, ACCESS_LIST_GRID_COLS_VIEW)

export function getAccessListGridClass(hasActionsColumn: boolean): string {
  return hasActionsColumn ? ACCESS_LIST_ROW_GRID_ADMIN : ACCESS_LIST_ROW_GRID_VIEW
}

export const ACCESS_LIST_HEADER_GRID_ADMIN = cn(
  "hidden border-b border-border/60 bg-muted/25 px-5 py-3",
  ACCESS_LIST_GRID_BASE,
  ACCESS_LIST_GRID_COLS_ADMIN,
)

export const ACCESS_LIST_HEADER_GRID_VIEW = cn(
  "hidden border-b border-border/60 bg-muted/25 px-5 py-3",
  ACCESS_LIST_GRID_BASE,
  ACCESS_LIST_GRID_COLS_VIEW,
)
