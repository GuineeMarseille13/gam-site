import { cn } from "@/helpers/utils"

/**
 * Styles Select bureau : remplace le token `accent` vert global (survol / sélection).
 */
export const bureauSelectItemClassName = cn(
  "cursor-pointer rounded-lg py-2.5 text-foreground",
  "data-[highlighted]:bg-amber-50 data-[highlighted]:text-amber-900",
  "data-[state=checked]:bg-amber-100 data-[state=checked]:text-amber-900",
  "focus:bg-amber-50 focus:text-amber-900",
  "data-[highlighted]:[&_.text-muted-foreground]:text-amber-800/80",
  "data-[state=checked]:[&_.text-muted-foreground]:text-amber-800/80",
  "data-[highlighted]:[&_svg]:text-amber-700",
  "data-[state=checked]:[&_svg]:text-amber-700",
  "dark:data-[highlighted]:bg-amber-950/40 dark:data-[highlighted]:text-amber-200",
  "dark:data-[state=checked]:bg-amber-950/50 dark:data-[state=checked]:text-amber-200",
  "dark:data-[highlighted]:[&_.text-muted-foreground]:text-amber-300/85",
  "dark:data-[state=checked]:[&_.text-muted-foreground]:text-amber-300/85",
)

export const bureauSelectContentClassName = cn(
  "rounded-xl border border-border bg-popover p-1.5 shadow-lg",
  "dark:border-border",
)

/** Aligné sur les `Input` du formulaire bureau — sans fond vert `accent`. */
export const bureauSelectTriggerClassName = cn(
  "h-10 w-full rounded-xl border border-input bg-background text-foreground shadow-xs",
  "transition-[color,box-shadow,background-color,border-color]",
  "hover:border-input hover:bg-muted/50",
  "focus-visible:border-input focus-visible:ring-[3px] focus-visible:ring-ring/50",
  "data-[state=open]:border-input data-[state=open]:bg-background data-[state=open]:ring-[3px] data-[state=open]:ring-ring/50",
  "dark:border-input dark:bg-card dark:hover:bg-muted/30",
  "dark:data-[state=open]:bg-card",
  "[&_svg]:text-muted-foreground",
)
