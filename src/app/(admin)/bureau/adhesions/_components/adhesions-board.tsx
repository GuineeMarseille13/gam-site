import { Card, CardContent } from "@/components/ui/card"
import type { AdhesionWithRelations } from "../_types/adhesion-with-relations.type"
import { AdhesionsDesktopTable } from "./adhesions-desktop-table"
import { AdhesionsMobileCards } from "./adhesions-mobile-cards"

interface AdhesionsBoardProps {
  adhesions: AdhesionWithRelations[]
}

/**
 * Liste des adhésions : cartes sur petit écran, tableau responsive (scroll) à partir de md.
 */
export function AdhesionsBoard({ adhesions }: AdhesionsBoardProps) {
  if (adhesions.length === 0) {
    return (
      <Card>
        <CardContent className="flex min-h-[12rem] items-center justify-center px-6 py-10 text-center text-sm text-muted-foreground">
          Aucune adhésion enregistrée
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <AdhesionsMobileCards adhesions={adhesions} />
      <AdhesionsDesktopTable adhesions={adhesions} />
    </>
  )
}
