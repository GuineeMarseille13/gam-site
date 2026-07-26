import {
  administrationGhostButtonClassName,
  administrationPrimaryButtonClassName,
} from "@/config/administration-dashboard-theme"
import {
  hebergementRelationGhostButtonClassName,
  hebergementRelationPrimaryButtonClassName,
} from "@/config/hebergement-relation-dashboard-theme"
import { cn } from "@/helpers/utils"
import type { ProfilDashboardScope } from "../_types/profil-dashboard-scope"

/**
 * Accents UI du formulaire « Mon profil » par dashboard.
 * Évite les couleurs bureau (ambre / rose) hors de leur espace.
 */
export interface ProfilFormTheme {
  readonly avatarFallbackClassName: string
  readonly passwordIconBadgeClassName: string
  readonly primaryButtonClassName: string
  readonly passwordButtonClassName: string
  readonly ghostButtonClassName: string
  readonly requiredMarkClassName: string
  readonly posteBadgeClassName: string
}

const bureauPrimaryButtonClassName = cn(
  "rounded-xl bg-rose-500 font-semibold text-white shadow-sm shadow-rose-500/20",
  "hover:bg-rose-600",
)

const bureauPasswordButtonClassName = cn(
  "rounded-xl bg-amber-500 font-semibold text-white shadow-sm shadow-amber-500/20",
  "hover:bg-amber-600",
)

export const PROFIL_FORM_THEMES: Record<ProfilDashboardScope, ProfilFormTheme> = {
  bureau: {
    avatarFallbackClassName: cn(
      "bg-gradient-to-br from-amber-100 to-amber-200 text-amber-800",
      "dark:from-amber-900/40 dark:to-amber-800/40 dark:text-amber-300",
    ),
    passwordIconBadgeClassName: cn(
      "bg-amber-100 text-amber-600",
      "dark:bg-amber-900/40 dark:text-amber-400",
    ),
    primaryButtonClassName: bureauPrimaryButtonClassName,
    passwordButtonClassName: bureauPasswordButtonClassName,
    ghostButtonClassName: "rounded-xl text-muted-foreground hover:text-foreground",
    requiredMarkClassName: "text-destructive",
    posteBadgeClassName: cn(
      "bg-rose-50 text-rose-700 ring-rose-200",
      "dark:bg-rose-950/40 dark:text-rose-400 dark:ring-rose-800/40",
    ),
  },
  administration: {
    avatarFallbackClassName: cn(
      "bg-gradient-to-br from-sky-100 to-sky-200 text-sky-900",
      "dark:from-sky-950/80 dark:to-sky-900/60 dark:text-sky-200",
    ),
    passwordIconBadgeClassName: cn(
      "bg-sky-100 text-sky-700",
      "dark:bg-sky-950/50 dark:text-sky-300",
    ),
    primaryButtonClassName: cn("rounded-xl font-semibold", administrationPrimaryButtonClassName),
    passwordButtonClassName: cn("rounded-xl font-semibold", administrationPrimaryButtonClassName),
    ghostButtonClassName: cn("rounded-xl", administrationGhostButtonClassName),
    requiredMarkClassName: "text-sky-600 dark:text-sky-400",
    posteBadgeClassName: cn(
      "bg-sky-50 text-sky-900 ring-sky-200/70",
      "dark:bg-sky-950/45 dark:text-sky-200 dark:ring-sky-800/50",
    ),
  },
  "hebergement-relation": {
    avatarFallbackClassName: cn(
      "bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-900",
      "dark:from-emerald-950/80 dark:to-emerald-900/60 dark:text-emerald-200",
    ),
    passwordIconBadgeClassName: cn(
      "bg-emerald-100 text-emerald-700",
      "dark:bg-emerald-950/50 dark:text-emerald-300",
    ),
    primaryButtonClassName: cn(
      "rounded-xl font-semibold",
      hebergementRelationPrimaryButtonClassName,
    ),
    passwordButtonClassName: cn(
      "rounded-xl font-semibold",
      hebergementRelationPrimaryButtonClassName,
    ),
    ghostButtonClassName: cn("rounded-xl", hebergementRelationGhostButtonClassName),
    requiredMarkClassName: "text-emerald-700 dark:text-emerald-400",
    posteBadgeClassName: cn(
      "bg-emerald-50 text-emerald-900 ring-emerald-200/70",
      "dark:bg-emerald-950/45 dark:text-emerald-200 dark:ring-emerald-800/50",
    ),
  },
}
