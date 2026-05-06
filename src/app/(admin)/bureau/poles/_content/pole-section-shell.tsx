import type { ReactNode } from "react"
import { BureauContent } from "@/components/bureau/bureau-content"
import { Card, CardContent } from "@/components/ui/card"

interface BureauPoleSectionShellProps {
  title: string
  description?: string
  children?: ReactNode
}

/**
 * Enveloppe des sous-pages d’édition de contenu pôle (`/bureau/poles/{slug}/…`).
 */
export function BureauPoleSection({
  title,
  description,
  children,
}: BureauPoleSectionShellProps) {
  return (
    <BureauContent title={title} description={description} backHref="/bureau/poles">
      <Card className="border-border/80 shadow-sm">
        <CardContent className="py-10 sm:py-12 text-center text-sm text-muted-foreground px-4 sm:px-6">
          {children ?? "Contenu à définir."}
        </CardContent>
      </Card>
    </BureauContent>
  )
}
