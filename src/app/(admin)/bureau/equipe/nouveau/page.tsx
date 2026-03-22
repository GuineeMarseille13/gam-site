import { BureauDataPage } from "@/components/bureau/bureau-data-page"
import { Card, CardContent } from "@/components/ui/card"
import { createMembreEquipe } from "../_actions/actions"
import { EquipeForm } from "../_components/equipe-form"

export default function NouveauMembrePage() {
  return (
    <BureauDataPage title="Nouveau membre" description="Créez un compte bureau et ajoutez-le à l'équipe">
      <Card>
        <CardContent className="pt-6">
          <EquipeForm mode="create" createAction={createMembreEquipe} />
        </CardContent>
      </Card>
    </BureauDataPage>
  )
}
