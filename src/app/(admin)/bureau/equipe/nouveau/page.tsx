import { BureauContent } from "@/components/bureau/bureau-content"
import { Card, CardContent } from "@/components/ui/card"
import { createMembreEquipe } from "../_actions/actions"
import { EquipeForm } from "../_components/equipe-form"

export default function NouveauMembrePage() {
  return (
    <BureauContent
      title="Nouveau membre"
      description="Ajoutez un membre du bureau à l'équipe (fiche personne, sans accès dashboard)."
    >
      <Card>
        <CardContent className="pt-6">
          <EquipeForm mode="create" createAction={createMembreEquipe} />
        </CardContent>
      </Card>
    </BureauContent>
  )
}
