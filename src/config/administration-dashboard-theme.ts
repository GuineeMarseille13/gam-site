import { cn } from "@/lib/utils"

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
