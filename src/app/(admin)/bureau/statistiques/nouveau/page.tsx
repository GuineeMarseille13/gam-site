import { BureauContent } from "@/components/bureau/bureau-content"
import { Card, CardContent } from "@/components/ui/card"
import { createStatistique } from "../_actions/actions"
import { StatistiqueForm } from "../_components/statistique-form"

export default function NouvelleStatistiquePage() {
  return (
    <BureauContent title="Nouvelle statistique" description="Ajouter une statistique à afficher sur le site">
      <Card>
        <CardContent className="pt-6">
          <StatistiqueForm action={createStatistique} />
        </CardContent>
      </Card>
    </BureauContent>
  )
}
