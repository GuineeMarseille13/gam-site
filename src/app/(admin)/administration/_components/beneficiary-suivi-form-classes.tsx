import { cn } from "@/lib/utils"

/**
 * Astérisque obligatoire (bleu) pour le formulaire Demande bénéficiaire.
 */
export function BeneficiaryRequiredMark() {
  return (
    <span className="ml-0.5 font-semibold text-blue-600 dark:text-blue-400" aria-hidden>
      *
    </span>
  )
}

const beneficiarySuiviControlBase = cn(
  "border-sky-200/80 bg-background shadow-sm",
  "transition-[color,box-shadow,background-color,border-color]",
  "hover:border-sky-400 hover:bg-sky-50/80",
  "focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-500/30",
  "dark:border-sky-800 dark:bg-background",
  "dark:hover:border-sky-500 dark:hover:bg-sky-950/40",
  "dark:focus-visible:border-sky-400 dark:focus-visible:ring-sky-400/25",
)

/** Champs texte — bordures sky, hover / focus alignés (évite l’accent thème trop saturé). */
export const beneficiarySuiviInputClassName = cn("h-11", beneficiarySuiviControlBase)

export const beneficiarySuiviTextareaClassName = cn(
  beneficiarySuiviControlBase,
  "min-h-[5.5rem] w-full min-w-0 resize-y py-2.5 leading-relaxed",
)

/** Select — état ouvert / hover en sky (pas accent). */
export const beneficiarySuiviSelectTriggerClassName = cn(
  "h-11 w-full min-w-0 max-w-full",
  beneficiarySuiviControlBase,
  "hover:bg-sky-50/90",
  "data-[state=open]:border-sky-500 data-[state=open]:bg-sky-50/80 data-[state=open]:shadow-sm",
  "focus-visible:ring-[3px] focus-visible:ring-sky-500/35",
  "dark:hover:bg-sky-950/45",
  "dark:data-[state=open]:border-sky-400 dark:data-[state=open]:bg-sky-950/55",
  "dark:focus-visible:ring-sky-400/35",
)

/** Carte mobile — liste Suivi demande. */
export const beneficiaryTrackingCardClassName = cn(
  "rounded-xl border border-sky-200/55 bg-sky-50/30 shadow-sm",
  "transition-[border-color,background-color,box-shadow]",
  "hover:border-sky-400/70 hover:bg-sky-50/55 hover:shadow-md",
  "dark:border-sky-900/45 dark:bg-sky-950/20",
  "dark:hover:border-sky-600/55 dark:hover:bg-sky-950/35",
)

/** Conteneur tableau desktop — Suivi demande. */
export const beneficiaryTrackingTableShellClassName = cn(
  "relative w-full overflow-x-auto rounded-lg border border-sky-200/60 bg-sky-50/15 shadow-sm",
  "dark:border-sky-900/40 dark:bg-sky-950/15",
)

/** En-tête de colonnes — fond sky discret. */
export const beneficiaryTrackingTableHeaderRowClassName = cn(
  "border-sky-200/60 bg-sky-50/90 hover:bg-sky-50/90",
  "dark:border-sky-800/60 dark:bg-sky-950/45 dark:hover:bg-sky-950/45",
)

/** Ligne corps — survol ligne. */
export const beneficiaryTrackingTableBodyRowClassName = cn(
  "border-border/50 transition-colors",
  "hover:bg-sky-50/75 dark:hover:bg-sky-950/40",
)

/** Bloc section détail (lecture seule). */
export const beneficiaryTrackingSectionClassName = cn(
  "space-y-3 rounded-xl border border-sky-200/50 bg-sky-50/20 p-4 shadow-sm",
  "dark:border-sky-900/40 dark:bg-sky-950/15",
)

/** Titre de section détail. */
export const beneficiaryTrackingSectionTitleClassName =
  "text-base font-semibold text-sky-950 dark:text-sky-100"

/** Bouton contour secondaire (navigation). */
export const beneficiaryTrackingOutlineButtonClassName = cn(
  "border-sky-200/80 bg-background text-sky-800 shadow-sm",
  "transition-[color,box-shadow,background-color,border-color]",
  "hover:border-sky-400 hover:bg-sky-50 hover:text-sky-950",
  "dark:border-sky-800 dark:bg-background dark:text-sky-100",
  "dark:hover:border-sky-500 dark:hover:bg-sky-950/40 dark:hover:text-sky-50",
)

/** Lien / bouton ghost retour. */
export const beneficiaryTrackingGhostNavClassName = cn(
  "text-muted-foreground",
  "transition-colors hover:bg-sky-100/90 hover:text-sky-900",
  "dark:hover:bg-sky-950/50 dark:hover:text-sky-100",
)

/** Carte formulaire statut (Suivi demande — détail). */
export const beneficiaryTrackingStatusCardClassName = cn(
  "space-y-4 rounded-xl border border-sky-200/60 bg-sky-50/35 p-4 shadow-sm",
  "transition-[border-color,background-color]",
  "dark:border-sky-900/50 dark:bg-sky-950/25",
)

/** Bouton primaire enregistrement — hover renforcé. */
export const beneficiaryTrackingPrimaryButtonClassName = cn(
  "bg-sky-600 text-white shadow-sm shadow-sky-600/20",
  "transition-[color,box-shadow,background-color]",
  "hover:bg-sky-700 hover:shadow-md hover:shadow-sky-600/30",
  "disabled:opacity-50 disabled:shadow-none",
)

/** Bouton lien « Détail » (liste). */
export const beneficiaryTrackingDetailLinkButtonClassName = cn(
  "h-9 gap-1 border-sky-200/80 text-sky-800",
  "transition-[color,box-shadow,background-color,border-color]",
  "hover:border-sky-400 hover:bg-sky-50 hover:text-sky-950",
  "dark:border-sky-800 dark:text-sky-100",
  "dark:hover:border-sky-500 dark:hover:bg-sky-950/45 dark:hover:text-sky-50",
)

/** Lien ghost « Détail » (tableau). */
export const beneficiaryTrackingDetailGhostClassName = cn(
  "h-9 gap-1 text-sky-700",
  "transition-colors",
  "hover:bg-sky-100/90 hover:text-sky-950",
  "dark:text-sky-300 dark:hover:bg-sky-950/55 dark:hover:text-sky-50",
)
