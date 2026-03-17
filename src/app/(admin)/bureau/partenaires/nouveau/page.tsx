import { BureauDataPage } from "@/components/bureau/bureau-data-page"
import { Card, CardContent } from "@/components/ui/card"
import { createPartenaire } from "../_actions/actions"
import { PartenaireForm } from "../_components/partenaire-form"

export default function NouveauPartenairePage() {
  return (
    <BureauDataPage title="Nouveau partenaire" description="Ajouter un nouveau partenaire">
      <Card>
        <CardContent className="pt-6">
          <PartenaireForm action={createPartenaire} />
        </CardContent>
      </Card>
    </BureauDataPage>
  )
}
