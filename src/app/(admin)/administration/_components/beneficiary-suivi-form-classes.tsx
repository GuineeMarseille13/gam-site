import { cn } from "@/lib/utils"

/**
 * Astérisque obligatoire — aligné sur la palette sky du parcours.
 */
export function BeneficiaryRequiredMark() {
  return (
    <span className="ml-0.5 font-semibold text-sky-600 dark:text-sky-400" aria-hidden>
      *
    </span>
  )
}

/** Champs : bordure discrète, survol adouci (évite le saut sky-400 trop fort). */
const beneficiarySuiviControlBase = cn(
  "border border-sky-200/70 bg-background shadow-sm",
  "transition-[color,box-shadow,background-color,border-color]",
  "hover:border-sky-300 hover:bg-sky-50/75",
  "focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-500/25",
  "dark:border-sky-800/70 dark:bg-background",
  "dark:hover:border-sky-700 dark:hover:bg-sky-950/40",
  "dark:focus-visible:border-sky-500 dark:focus-visible:ring-sky-400/20",
)

export const beneficiarySuiviInputClassName = cn("h-11", beneficiarySuiviControlBase)

export const beneficiarySuiviTextareaClassName = cn(
  beneficiarySuiviControlBase,
  "min-h-[5.5rem] w-full min-w-0 resize-y py-2.5 leading-relaxed",
)

export const beneficiarySuiviSelectTriggerClassName = cn(
  "h-11 w-full min-w-0 max-w-full",
  beneficiarySuiviControlBase,
  "text-foreground hover:bg-sky-100/85 hover:text-sky-950",
  "dark:hover:bg-sky-950/45 dark:hover:text-sky-50",
  "data-[placeholder]:text-sky-800/90 dark:data-[placeholder]:text-sky-300",
  "[&_svg]:text-sky-700 dark:[&_svg]:text-sky-300",
  "hover:[&_svg]:text-sky-900 dark:hover:[&_svg]:text-sky-100",
  "data-[state=open]:border-sky-400 data-[state=open]:bg-sky-50/90 data-[state=open]:text-sky-950 data-[state=open]:shadow-md",
  "data-[state=open]:[&_svg]:text-sky-900",
  "focus-visible:ring-[3px] focus-visible:ring-sky-500/25",
  "dark:data-[state=open]:border-sky-600 dark:data-[state=open]:bg-sky-950/50 dark:data-[state=open]:text-sky-50",
  "dark:data-[state=open]:[&_svg]:text-sky-200",
  "dark:focus-visible:ring-sky-400/22",
)

/** Déclencheur outline commun (calendrier, listes). — Survol lisible vs. `outline` (accent-foreground). */
const beneficiarySuiviOutlineTriggerCore = cn(
  "border border-sky-200/70 bg-background text-foreground shadow-sm",
  "[&_svg]:text-sky-700 dark:[&_svg]:text-sky-300",
  "transition-[color,box-shadow,background-color,border-color]",
  "hover:border-sky-300 hover:bg-sky-100/85 hover:text-sky-950",
  "hover:[&_svg]:text-sky-900 dark:hover:[&_svg]:text-sky-100",
  "data-[state=open]:border-sky-400 data-[state=open]:bg-sky-50/90 data-[state=open]:text-sky-950 data-[state=open]:shadow-md",
  "data-[state=open]:[&_svg]:text-sky-900",
  "dark:border-sky-800/70 dark:bg-background",
  "dark:hover:border-sky-600 dark:hover:bg-sky-950/45 dark:hover:text-sky-50",
  "dark:data-[state=open]:border-sky-600 dark:data-[state=open]:bg-sky-950/50 dark:data-[state=open]:text-sky-50",
  "dark:data-[state=open]:[&_svg]:text-sky-200",
)

/** Bouton-calendrier (étapes date / naissance). */
export const beneficiarySuiviDateTriggerClassName = cn(
  "h-auto min-h-11 w-full max-w-full justify-start px-3 py-2.5 text-left text-sm font-normal sm:max-w-md sm:text-base",
  beneficiarySuiviOutlineTriggerCore,
)

/** Texte « Choisir une date » / vide — lisible au repos et au survol. */
export const beneficiarySuiviTriggerPlaceholderClassName = cn(
  "text-sky-800/90 dark:text-sky-300",
  "hover:text-sky-950 dark:hover:text-sky-50",
)

/** Déclencheur multi-select types de demande. */
export const beneficiarySuiviMultiSelectTriggerClassName = cn(
  "h-auto min-h-11 w-full max-w-full justify-between gap-2 px-3 py-2.5 text-left text-sm font-normal sm:max-w-xl",
  beneficiarySuiviOutlineTriggerCore,
)

/** Ligne d’option dans un popover (types de demande). */
export const beneficiarySuiviPopoverListItemClassName = cn(
  "rounded-md text-foreground transition-[background-color,color]",
  "hover:bg-sky-100/90 hover:text-sky-950",
  "focus-visible:bg-sky-100/90 focus-visible:text-sky-950 focus-visible:outline-none",
  "dark:hover:bg-sky-900/40 dark:hover:text-sky-50",
  "dark:focus-visible:bg-sky-900/40 dark:focus-visible:text-sky-50",
)

/** Ligne cochée dans un popover multi-select (repère visuel + lisible au survol). */
export const beneficiarySuiviPopoverListItemSelectedClassName = cn(
  "bg-sky-50/82 dark:bg-sky-950/40",
)

/** Case à cocher document / type — bordure lisible, état coché stable. */
export const beneficiarySuiviCheckboxClassName = cn(
  "mt-0.5 border-sky-400/70",
  "data-[state=checked]:border-sky-600 data-[state=checked]:bg-sky-600",
  "dark:data-[state=checked]:border-sky-500 dark:data-[state=checked]:bg-sky-500",
)

/** Carte mobile — liste Suivi demande. */
export const beneficiaryTrackingCardClassName = cn(
  "rounded-xl border border-sky-200/60 bg-sky-50/28 shadow-sm",
  "transition-[border-color,background-color,box-shadow]",
  "hover:border-sky-300/90 hover:bg-sky-50/50 hover:shadow-md",
  "dark:border-sky-900/50 dark:bg-sky-950/22",
  "dark:hover:border-sky-700/70 dark:hover:bg-sky-950/38",
)

export const beneficiaryTrackingTableShellClassName = cn(
  "relative w-full overflow-x-auto rounded-lg border border-sky-200/65 bg-sky-50/18 shadow-sm",
  "dark:border-sky-900/45 dark:bg-sky-950/18",
)

export const beneficiaryTrackingTableHeaderRowClassName = cn(
  "border-sky-200/65 bg-sky-50/85 hover:bg-sky-50/85",
  "dark:border-sky-800/60 dark:bg-sky-950/42 dark:hover:bg-sky-950/42",
)

export const beneficiaryTrackingTableBodyRowClassName = cn(
  "border-border/50 transition-colors",
  "hover:bg-sky-50/80 dark:hover:bg-sky-950/40",
)

export const beneficiaryTrackingSectionClassName = cn(
  "space-y-3 rounded-xl border border-sky-200/55 bg-sky-50/22 p-4 shadow-sm",
  "dark:border-sky-900/45 dark:bg-sky-950/18",
)

export const beneficiaryTrackingSectionTitleClassName =
  "text-base font-semibold text-sky-950 dark:text-sky-100"

export const beneficiaryTrackingOutlineButtonClassName = cn(
  "border border-sky-200/70 bg-background text-sky-900 shadow-sm",
  "transition-[color,box-shadow,background-color,border-color]",
  "hover:border-sky-300 hover:bg-sky-50/80 hover:text-sky-950",
  "dark:border-sky-800/70 dark:bg-background dark:text-sky-100",
  "dark:hover:border-sky-700 dark:hover:bg-sky-950/42 dark:hover:text-sky-50",
)

/** Bouton primaire (formulaires, assistant). */
export const beneficiarySuiviPrimaryButtonClassName = cn(
  "bg-sky-600 text-white shadow-sm shadow-sky-600/15",
  "transition-[background-color,box-shadow,filter]",
  "hover:bg-sky-700 hover:shadow-md hover:shadow-sky-700/18",
  "active:bg-sky-800",
  "disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none",
)

export const beneficiaryTrackingGhostNavClassName = cn(
  "text-muted-foreground",
  "transition-colors hover:bg-sky-100/70 hover:text-sky-900",
  "dark:hover:bg-sky-900/40 dark:hover:text-sky-100",
)

export const beneficiaryTrackingStatusCardClassName = cn(
  "space-y-4 rounded-xl border border-sky-200/60 bg-sky-50/32 p-4 shadow-sm",
  "transition-[border-color,background-color]",
  "dark:border-sky-900/50 dark:bg-sky-950/25",
)

export const beneficiaryTrackingPrimaryButtonClassName = beneficiarySuiviPrimaryButtonClassName

export const beneficiaryTrackingDetailLinkButtonClassName = cn(
  "h-9 gap-1 border border-sky-200/70 text-sky-900",
  "transition-[color,box-shadow,background-color,border-color]",
  "hover:border-sky-300 hover:bg-sky-50/80 hover:text-sky-950",
  "dark:border-sky-800/70 dark:text-sky-100",
  "dark:hover:border-sky-700 dark:hover:bg-sky-950/42 dark:hover:text-sky-50",
)

export const beneficiaryTrackingDetailGhostClassName = cn(
  "h-9 gap-1 text-sky-800",
  "transition-colors",
  "hover:bg-sky-100/70 hover:text-sky-950",
  "dark:text-sky-200 dark:hover:bg-sky-900/40 dark:hover:text-sky-50",
)

/** Icône modifier (tableaux paramètres). */
export const beneficiarySuiviTableIconEditClassName = cn(
  "transition-colors",
  "hover:bg-sky-100/70 hover:text-sky-900",
  "dark:hover:bg-sky-900/40 dark:hover:text-sky-100",
)

/** Rangée document fourni (checkbox + libellé). */
export const beneficiarySuiviDocumentRowClassName = cn(
  "flex cursor-pointer items-start gap-2 rounded-md border border-border/75 px-2 py-2 text-sm",
  "transition-[border-color,background-color,color]",
  "hover:border-sky-300/80 hover:bg-sky-50/70",
  "dark:border-border/60 dark:hover:border-sky-800 dark:hover:bg-sky-950/35",
)

export const beneficiarySuiviDocumentRowSelectedClassName = cn(
  "border-sky-400/65 bg-sky-50/55",
  "dark:border-sky-700 dark:bg-sky-950/42",
)

/** Encart précision document. */
export const beneficiarySuiviDocumentDetailBoxClassName = cn(
  "space-y-2 rounded-md border border-sky-200/65 bg-sky-50/38 px-3 py-3",
  "dark:border-sky-900/45 dark:bg-sky-950/30",
)
