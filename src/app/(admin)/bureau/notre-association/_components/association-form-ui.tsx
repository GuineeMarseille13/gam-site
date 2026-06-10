import type { ReactNode } from "react"
import type { Icon } from "@tabler/icons-react"

import { SubmitButton } from "@/components/bureau/submit-button"
import { cn } from "@/helpers/utils"

interface AssociationFormFieldProps {
  label: string
  htmlFor?: string
  helper?: string
  icon?: Icon
  children: ReactNode
  className?: string
  compact?: boolean
}

/**
 * Bloc de champ formulaire bureau — label, aide et contenu.
 */
export function AssociationFormField({
  label,
  htmlFor,
  helper,
  icon: Icon,
  children,
  className,
  compact = false,
}: AssociationFormFieldProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-start gap-3">
        {Icon ? (
          <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/15 to-amber-600/5 text-amber-600 ring-1 ring-amber-500/10">
            <Icon className="size-4" />
          </div>
        ) : null}
        <div className="min-w-0 flex-1 space-y-1">
          <label
            htmlFor={htmlFor}
            className="text-sm font-semibold tracking-tight text-foreground"
          >
            {label}
          </label>
          {helper ? (
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">{helper}</p>
          ) : null}
        </div>
      </div>
      <div className={Icon && !compact ? "sm:pl-12" : undefined}>{children}</div>
    </div>
  )
}

interface AssociationFormPanelProps {
  children: ReactNode
  className?: string
}

/**
 * Panneau éditeur avec fond léger et bordure subtile.
 */
export function AssociationFormPanel({ children, className }: AssociationFormPanelProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/50 bg-gradient-to-b from-muted/30 to-background p-4 shadow-sm ring-1 ring-black/[0.02]",
        "dark:from-muted/15 dark:ring-white/[0.03] sm:p-5",
        className,
      )}
    >
      {children}
    </div>
  )
}

interface AssociationFormFooterProps {
  hint?: string
  className?: string
}

/**
 * Pied de formulaire sticky avec bouton d'enregistrement.
 */
export function AssociationFormFooter({ hint, className }: AssociationFormFooterProps) {
  return (
    <div
      className={cn(
        "sticky bottom-0 z-10 -mx-4 flex items-center justify-between gap-4 border-t border-border/50 bg-background/90 px-4 py-3 backdrop-blur-md",
        "sm:-mx-6 sm:px-6 md:-mx-8 md:px-8",
        "lg:static lg:mx-0 lg:rounded-2xl lg:border lg:bg-muted/20 lg:px-5 lg:py-4 lg:backdrop-blur-none",
        className,
      )}
    >
      {hint ? (
        <p className="hidden max-w-md text-xs leading-relaxed text-muted-foreground sm:block">
          {hint}
        </p>
      ) : (
        <span className="hidden sm:block" />
      )}
      <SubmitButton
        intent="bureau"
        className="ml-auto h-11 w-full rounded-xl px-6 shadow-md sm:w-auto sm:min-w-[12rem]"
      />
    </div>
  )
}

export const associationInputClassName =
  "h-11 rounded-xl border-border/60 bg-background/80 shadow-sm transition-shadow focus-visible:border-amber-400/60 focus-visible:ring-2 focus-visible:ring-amber-500/15"

export const associationTextareaClassName =
  "rounded-2xl border-border/60 bg-background/80 text-base leading-relaxed shadow-sm transition-shadow focus-visible:border-amber-400/60 focus-visible:ring-2 focus-visible:ring-amber-500/15"
