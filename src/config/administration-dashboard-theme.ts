import { cn } from "@/helpers/utils"

/**
 * Attribut à poser sur le shell du dashboard Administration pour activer les variables CSS
 * (`globals.css`, bloc `[data-dashboard="administration"]`).
 *
 * Variables disponibles :
 * - Surfaces : `--admin-dashboard-canvas`, `--admin-card-border`, `--admin-muted`
 * - Primaire : `--admin-primary`, `--admin-primary-foreground`, `--admin-primary-hover`,
 *   `--admin-primary-active`, `--admin-primary-shadow`, `--admin-primary-shadow-hover`, `--admin-primary-ring`
 * - Secondaire : `--admin-secondary-border`, `--admin-secondary-bg`, `--admin-secondary-foreground`,
 *   `--admin-secondary-hover-*`, `--admin-secondary-active-bg`
 * - Icônes : `--admin-icon-badge-bg`, `--admin-icon-badge-fg`
 * - Survols UI : `--accent` / `--accent-foreground` réassignés au secondaire sky (ghost, outline, menus)
 */
export const ADMINISTRATION_DASHBOARD_DATA_ATTR = {
  "data-dashboard": "administration",
} as const

/** Classes du `SidebarProvider` (hauteur vue). */
export const administrationDashboardProviderClassName = "min-h-svh"

/**
 * Fond de la zone principale (`SidebarInset`).
 */
export const administrationDashboardCanvasClassName =
  "bg-[var(--admin-dashboard-canvas)]"

/**
 * Bouton CTA principal — fond / texte / ombres / survol / actif via variables.
 */
export const administrationPrimaryButtonClassName = cn(
  "bg-[var(--admin-primary)] text-[var(--admin-primary-foreground)]",
  "shadow-[0_1px_2px_0_var(--admin-primary-shadow)]",
  "transition-[background-color,box-shadow,filter]",
  "hover:bg-[var(--admin-primary-hover)] hover:shadow-[0_4px_6px_-1px_var(--admin-primary-shadow-hover)]",
  "active:bg-[var(--admin-primary-active)] active:shadow-[0_1px_2px_0_var(--admin-primary-shadow)]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--admin-dashboard-canvas)]",
)

/**
 * Bouton secondaire (contour) — bordure / fond / survol / actif via variables.
 */
export const administrationOutlineButtonClassName = cn(
  "border border-[var(--admin-secondary-border)] bg-[var(--admin-secondary-bg)] text-[var(--admin-secondary-foreground)]",
  "shadow-xs",
  "transition-[color,box-shadow,background-color,border-color]",
  "hover:border-[var(--admin-secondary-hover-border)] hover:bg-[var(--admin-secondary-hover-bg)] hover:text-[var(--admin-secondary-hover-foreground)]",
  "active:bg-[var(--admin-secondary-active-bg)]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--admin-dashboard-canvas)]",
)

/**
 * Carte standard — bordure surface.
 */
export const administrationCardClassName = cn(
  "border border-[var(--admin-card-border)] bg-card shadow-sm",
)

/**
 * Pastille d’icône en-tête de carte.
 */
export const administrationIconBadgeClassName = cn(
  "bg-[var(--admin-icon-badge-bg)] text-[var(--admin-icon-badge-fg)]",
)

/**
 * Surface atténuée (encarts, lignes de séparation légères).
 */
export const administrationMutedSurfaceClassName =
  "bg-[var(--admin-muted)]"

/**
 * Action destructive (suppression) — token sémantique, cohérent avec les autres modales admin.
 */
export const administrationDestructiveButtonClassName = cn(
  "bg-destructive text-destructive-foreground shadow-sm",
  "hover:bg-destructive/90",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/40 focus-visible:ring-offset-2",
)

/** Bouton ghost — survol aligné sur le secondaire admin (évite le vert global). */
export const administrationGhostButtonClassName = cn(
  "text-muted-foreground hover:text-[var(--admin-secondary-hover-foreground)]",
  "hover:bg-[var(--admin-secondary-hover-bg)]",
)

/** Lien / bouton ghost « Supprimer » dans les listes. */
export const administrationDestructiveGhostClassName = cn(
  "text-destructive hover:bg-destructive/10 hover:text-destructive",
  "dark:hover:bg-destructive/15",
)

/**
 * Modale de suppression — couleurs explicites sky (portail Radix hors `data-dashboard`).
 * Associer {@link ADMINISTRATION_DASHBOARD_DATA_ATTR} sur `AlertDialogContent` si possible.
 */
export const administrationDeleteDialogContentClassName = cn(
  "rounded-2xl border border-sky-200/70 bg-background shadow-xl shadow-sky-950/[0.06]",
  "dark:border-sky-800/55 dark:shadow-black/35",
)

export const administrationDeleteDialogHeaderClassName = cn(
  "flex flex-col items-center gap-3 px-8 pb-6 pt-8",
  "bg-sky-50/95 dark:bg-sky-950/40",
)

/** Pastille icône corbeille — fond sky, pictogramme destructive. */
export const administrationDeleteDialogIconClassName = cn(
  "flex size-14 items-center justify-center rounded-2xl ring-4 ring-sky-100/90",
  "bg-sky-100 text-destructive",
  "dark:bg-sky-900/50 dark:text-red-400 dark:ring-sky-950/55",
)

export const administrationDeleteDialogFooterClassName = cn(
  "border-sky-200/50 dark:border-sky-800/45",
)

/** Annuler — contour secondaire admin (portail-safe). */
export const administrationDeleteDialogCancelClassName = cn(
  "rounded-xl border border-sky-200/80 bg-background text-sky-950 shadow-xs",
  "hover:border-sky-300 hover:bg-sky-50 hover:text-sky-950",
  "dark:border-sky-800 dark:bg-card dark:text-sky-100",
  "dark:hover:border-sky-700 dark:hover:bg-sky-950/45",
)
