import { cn } from "@/lib/utils"

/**
 * Astérisque obligatoire (bleu) pour le formulaire suivi permanence.
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
