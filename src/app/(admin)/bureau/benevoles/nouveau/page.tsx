import { BureauDataPage } from "@/components/bureau/bureau-data-page"
import { Card, CardContent } from "@/components/ui/card"
import { createBenevole } from "../_actions/actions"
import { BenevoleForm } from "../_components/benevole-form"

export default function NouveauBenevolePage() {
  return (
    <BureauDataPage title="Nouveau bénévole" description="Ajouter un bénévole à l'équipe">
      <Card>
        <CardContent className="pt-6">
          <BenevoleForm action={createBenevole} />
        </CardContent>
      </Card>
    </BureauDataPage>
  )
}
