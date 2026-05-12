import { Card, CardContent } from "@/components/ui/card"
import type { DonWithRelations } from "../_types/don-with-relations.type"
import { DonsDesktopTable } from "./dons-desktop-table"
import { DonsMobileCards } from "./dons-mobile-cards"

interface DonsBoardProps {
  readonly dons: DonWithRelations[]
}

/**
 * Liste des dons : cartes sur petit écran, tableau responsive (scroll) à partir de md.
 */
export function DonsBoard({ dons }: DonsBoardProps) {
  if (dons.length === 0) {
    return (
      <Card>
        <CardContent className="flex min-h-[12rem] items-center justify-center px-6 py-10 text-center text-sm text-muted-foreground">
          Aucun don enregistré
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <DonsMobileCards dons={dons} />
      <DonsDesktopTable dons={dons} />
    </>
  )
}

