import type { ReactNode } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/helpers/utils"

interface BureauPoleDetailsPageCardProps {
  children: ReactNode
  className?: string
}

/**
 * Carte commune aux pages d’édition de contenu pôle.
 */
export function BureauPoleDetailsPageCard({
  children,
  className,
}: BureauPoleDetailsPageCardProps) {
  return (
    <Card
      className={cn(
        "w-full max-w-6xl overflow-hidden border-border/60 bg-card shadow-md py-0",
        className,
      )}
    >
      <CardContent className="p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10">
        {children}
      </CardContent>
    </Card>
  )
}
