import { BureauContent } from "@/components/bureau/bureau-content"
import { Card, CardContent } from "@/components/ui/card"
import { createMembreEquipe } from "../_actions/actions"
import { EquipeForm } from "../_components/equipe-form"

export default function NouveauMembrePage() {
  return (
    <BureauContent title="Nouveau membre" description="Créez un compte bureau et ajoutez-le à l'équipe">
      <Card>
        <CardContent className="pt-6">
          <EquipeForm mode="create" createAction={createMembreEquipe} />
        </CardContent>
      </Card>
    </BureauContent>
  )
}
