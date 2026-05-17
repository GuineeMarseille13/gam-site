import { Badge } from "@/components/ui/badge"
import { cn } from "@/helpers/utils"

interface DashboardAccessStatusBadgeProps {
  banned: boolean
  className?: string
}

/** Indicateur visuel actif / banni pour un compte dashboard. */
export function DashboardAccessStatusBadge({ banned, className }: DashboardAccessStatusBadgeProps) {
  if (banned) {
    return (
      <Badge
        variant="outline"
        className={cn(
          "border-rose-200/80 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300",
          className,
        )}
      >
        Accès suspendu
      </Badge>
    )
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "border-emerald-200/80 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300",
        className,
      )}
    >
      Actif
    </Badge>
  )
}
