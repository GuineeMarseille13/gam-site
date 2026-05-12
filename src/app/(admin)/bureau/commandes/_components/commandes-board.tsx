import { Card, CardContent } from "@/components/ui/card"
import type { OrderWithRelations } from "../_types/order-with-relations.type"
import { CommandesDesktopTable } from "./commandes-desktop-table"
import { CommandesMobileCards } from "./commandes-mobile-cards"

interface CommandesBoardProps {
  readonly commandes: OrderWithRelations[]
}

/**
 * Liste des commandes : cartes sur petit écran, tableau responsive à partir de md.
 */
export function CommandesBoard({ commandes }: CommandesBoardProps) {
  if (commandes.length === 0) {
    return (
      <Card>
        <CardContent className="flex min-h-[12rem] items-center justify-center px-6 py-10 text-center text-sm text-muted-foreground">
          Aucune commande enregistrée
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <CommandesMobileCards commandes={commandes} />
      <CommandesDesktopTable commandes={commandes} />
    </>
  )
}
