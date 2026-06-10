import type { ReactNode } from "react"
import type { Icon } from "@tabler/icons-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/helpers/utils"

interface BureauAssociationPageCardProps {
  title: string
  description: string
  children: ReactNode
  icon?: Icon
  className?: string
}

/**
 * Carte d'édition pour les sections Notre association (bureau).
 */
export function BureauAssociationPageCard({
  title,
  description,
  children,
  icon: Icon,
  className,
}: BureauAssociationPageCardProps) {
  return (
    <Card
      className={cn(
        "relative w-full max-w-6xl overflow-hidden border-0 bg-card py-0 shadow-lg shadow-black/[0.04] ring-1 ring-border/50",
        "dark:shadow-black/20",
        className,
      )}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400/80" />
      <CardHeader className="space-y-0 px-5 pb-0 pt-6 sm:px-8 sm:pt-8">
        <div className="flex items-start gap-4">
          {Icon ? (
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/30">
              <Icon className="size-5" stroke={1.75} />
            </div>
          ) : null}
          <div className="min-w-0 flex-1 space-y-1.5 pb-5">
            <CardTitle className="text-xl font-bold tracking-tight sm:text-2xl">{title}</CardTitle>
            <CardDescription className="text-sm leading-relaxed text-muted-foreground">
              {description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-6 pt-0 sm:px-8 sm:pb-8">{children}</CardContent>
    </Card>
  )
}
