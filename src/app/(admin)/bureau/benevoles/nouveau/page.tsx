import { BureauContent } from "@/components/bureau/bureau-content"
import { Card, CardContent } from "@/components/ui/card"
import { createBenevole } from "../_actions/actions"
import { BenevoleForm } from "../_components/benevole-form"

export default function NouveauBenevolePage() {
  return (
    <BureauContent title="Nouveau bénévole" description="Ajouter un bénévole à l'équipe">
      <Card>
        <CardContent className="pt-6">
          <BenevoleForm action={createBenevole} submitLabel="Ajouter un bénévole" />
        </CardContent>
      </Card>
    </BureauContent>
  )
}
