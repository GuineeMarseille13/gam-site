import { cn } from "@/helpers/utils"

/**
 * Styles Select administration : survol / sélection sky (portail Radix hors `data-dashboard`).
 * Remplace le token `accent` vert global et les styles ambre du bureau.
 */
export const administrationSelectItemClassName = cn(
  "cursor-pointer rounded-lg py-2.5 text-foreground",
  "data-[highlighted]:bg-sky-50 data-[highlighted]:text-sky-900",
  "data-[state=checked]:bg-sky-100 data-[state=checked]:text-sky-900",
  "focus:bg-sky-50 focus:text-sky-900",
  "data-[highlighted]:[&_.text-muted-foreground]:text-sky-800/80",
  "data-[state=checked]:[&_.text-muted-foreground]:text-sky-800/80",
  "data-[highlighted]:[&_svg]:text-sky-700",
  "data-[state=checked]:[&_svg]:text-sky-700",
  "dark:data-[highlighted]:bg-sky-950/40 dark:data-[highlighted]:text-sky-200",
  "dark:data-[state=checked]:bg-sky-950/50 dark:data-[state=checked]:text-sky-200",
  "dark:data-[highlighted]:[&_.text-muted-foreground]:text-sky-300/85",
  "dark:data-[state=checked]:[&_.text-muted-foreground]:text-sky-300/85",
  "dark:data-[highlighted]:[&_svg]:text-sky-400",
  "dark:data-[state=checked]:[&_svg]:text-sky-400",
)

export const administrationSelectContentClassName = cn(
  "rounded-xl border border-border bg-popover p-1.5 shadow-lg",
  "dark:border-border",
)

/** Aligné sur les champs du formulaire administration — sans fond `accent` global. */
export const administrationSelectTriggerClassName = cn(
  "h-10 w-full rounded-xl border border-input bg-background text-foreground shadow-xs",
  "transition-[color,box-shadow,background-color,border-color]",
  "hover:border-sky-200 hover:bg-sky-50/80",
  "focus-visible:border-sky-300 focus-visible:ring-[3px] focus-visible:ring-[var(--admin-primary-ring)]",
  "data-[state=open]:border-sky-300 data-[state=open]:bg-background data-[state=open]:ring-[3px] data-[state=open]:ring-[var(--admin-primary-ring)]",
  "dark:border-input dark:bg-card dark:hover:border-sky-800 dark:hover:bg-sky-950/35",
  "dark:data-[state=open]:border-sky-700 dark:data-[state=open]:bg-card",
  "[&_svg]:text-muted-foreground",
)
