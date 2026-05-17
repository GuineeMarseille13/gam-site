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

/** Lien / bouton ghost « Supprimer » dans les listes. */
export const administrationDestructiveGhostClassName = cn(
  "text-destructive hover:bg-destructive/10 hover:text-destructive",
  "dark:hover:bg-destructive/15",
)

/** En-tête visuel des modales de suppression (fond atténué du thème). */
export const administrationDeleteDialogHeaderClassName = cn(
  "flex flex-col items-center gap-3 px-8 pb-6 pt-8",
  administrationMutedSurfaceClassName,
)

/** Pastille icône corbeille dans une modale de suppression. */
export const administrationDeleteDialogIconClassName = cn(
  "flex size-14 items-center justify-center rounded-2xl ring-4 ring-[var(--admin-muted)]",
  administrationIconBadgeClassName,
)
