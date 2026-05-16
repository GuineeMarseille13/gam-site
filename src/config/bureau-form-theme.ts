import { cn } from "@/helpers/utils"

/** Section formulaire bureau — état neutre (clair + sombre). */
export const bureauFormSectionNeutral = cn(
  "border-border bg-muted/20",
  "dark:border-border dark:bg-muted/10",
)

/** Variantes de cartes section (réduction, catégorie, actif…). */
export const bureauFormSectionVariants = {
  amber: {
    active: cn(
      "border-amber-200 bg-amber-50/40",
      "dark:border-amber-800/50 dark:bg-amber-950/25",
    ),
    inactive: bureauFormSectionNeutral,
  },
  orange: {
    active: cn(
      "border-orange-200 bg-orange-50/50",
      "dark:border-orange-800/50 dark:bg-orange-950/25",
    ),
    inactive: bureauFormSectionNeutral,
  },
  emerald: {
    active: cn(
      "border-emerald-200 bg-emerald-50/50",
      "dark:border-emerald-800/40 dark:bg-emerald-950/20",
    ),
    inactive: bureauFormSectionNeutral,
  },
} as const

export const bureauFormIconWrapVariants = {
  amber: {
    active: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
    inactive: "bg-muted text-muted-foreground",
  },
  orange: {
    active: "bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400",
    inactive: "bg-muted text-muted-foreground",
  },
  emerald: {
    active: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
    inactive: "bg-muted text-muted-foreground",
  },
} as const

export const bureauFormIconVariants = {
  amber: {
    active: "text-amber-600 dark:text-amber-400",
    inactive: "text-muted-foreground",
  },
  orange: {
    active: "text-orange-600 dark:text-orange-400",
    inactive: "text-muted-foreground",
  },
  emerald: {
    active: "text-emerald-600 dark:text-emerald-400",
    inactive: "text-muted-foreground",
  },
} as const

export const bureauFormManageLinkClassName = cn(
  "h-8 gap-1 rounded-lg px-2 text-xs font-medium",
  "text-amber-700 hover:bg-amber-100/80 hover:text-amber-800",
  "dark:text-amber-400 dark:hover:bg-amber-950/40 dark:hover:text-amber-300",
)

export const bureauFormInlineLinkClassName = cn(
  "font-medium text-amber-700 underline-offset-2 hover:underline",
  "dark:text-amber-400",
)

export const bureauFormEmptyHintClassName = cn(
  "rounded-xl border border-dashed px-3 py-3 text-xs text-muted-foreground",
  "border-amber-200/80 bg-background/80",
  "dark:border-amber-800/50 dark:bg-background/50",
)

/** Interrupteurs — remplace `bg-primary` (rouge) dans les formulaires bureau. */
export const bureauSwitchVariants = {
  amber: "data-[state=checked]:bg-amber-500 dark:data-[state=checked]:bg-amber-600",
  orange: "data-[state=checked]:bg-orange-500 dark:data-[state=checked]:bg-orange-600",
  emerald: "data-[state=checked]:bg-emerald-600 dark:data-[state=checked]:bg-emerald-500",
} as const

export const bureauImageUploadHoverClassName = cn(
  "hover:border-amber-300/60 hover:bg-amber-50/30",
  "dark:hover:border-amber-700/40 dark:hover:bg-amber-950/20",
)
