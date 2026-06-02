import { cn } from "@/helpers/utils"

/**
 * Shell du dashboard Hébergement et mise en relation (`globals.css`, `[data-dashboard="hebergement-relation"]`).
 */
export const HERBERGEMENT_RELATION_DASHBOARD_DATA_ATTR = {
  "data-dashboard": "hebergement-relation",
} as const

export const hebergementRelationDashboardProviderClassName = "min-h-svh"

export const hebergementRelationDashboardCanvasClassName =
  "bg-[var(--hr-dashboard-canvas)]"

export const hebergementRelationPrimaryButtonClassName = cn(
  "bg-[var(--hr-primary)] text-[var(--hr-primary-foreground)]",
  "shadow-[0_1px_2px_0_var(--hr-primary-shadow)]",
  "transition-[background-color,box-shadow,filter]",
  "hover:bg-[var(--hr-primary-hover)] hover:shadow-[0_4px_6px_-1px_var(--hr-primary-shadow-hover)]",
  "active:bg-[var(--hr-primary-active)] active:shadow-[0_1px_2px_0_var(--hr-primary-shadow)]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hr-primary-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--hr-dashboard-canvas)]",
)

export const hebergementRelationOutlineButtonClassName = cn(
  "border border-[var(--hr-secondary-border)] bg-[var(--hr-secondary-bg)] text-[var(--hr-secondary-foreground)]",
  "shadow-xs",
  "transition-[color,box-shadow,background-color,border-color]",
  "hover:border-[var(--hr-secondary-hover-border)] hover:bg-[var(--hr-secondary-hover-bg)] hover:text-[var(--hr-secondary-hover-foreground)]",
  "active:bg-[var(--hr-secondary-active-bg)]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hr-primary-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--hr-dashboard-canvas)]",
)

export const hebergementRelationCardClassName = cn(
  "border border-[var(--hr-card-border)] bg-card shadow-sm",
)

export const hebergementRelationIconBadgeClassName = cn(
  "bg-[var(--hr-icon-badge-bg)] text-[var(--hr-icon-badge-fg)]",
)

export const hebergementRelationGhostButtonClassName = cn(
  "text-muted-foreground hover:text-[var(--hr-secondary-hover-foreground)]",
  "hover:bg-[var(--hr-secondary-hover-bg)]",
)

export const hebergementRelationDestructiveButtonClassName = cn(
  "bg-destructive text-destructive-foreground shadow-sm",
  "hover:bg-destructive/90",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/40 focus-visible:ring-offset-2",
)

export const hebergementRelationDestructiveGhostClassName = cn(
  "text-destructive hover:bg-destructive/10 hover:text-destructive",
  "dark:hover:bg-destructive/15",
)

// ceci me permet d'avoir une surface de fond pour les éléments désactivés (ex: le toggle d'affichage du formulaire d'hébergement sur la page publique) qui soit différente du canvas du dashboard, afin de mieux les différencier visuellement

 export const hebergementRelationMutedSurfaceClassName = cn(
  "bg-[var(--hr-muted)]",
)