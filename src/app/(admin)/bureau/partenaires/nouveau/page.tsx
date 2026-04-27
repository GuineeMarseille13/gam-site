import { BureauContent } from "@/components/bureau/bureau-content"
import { Card, CardContent } from "@/components/ui/card"
import { createPartenaire } from "../_actions/actions"
import { PartenaireForm } from "../_components/partenaire-form"

export default function NouveauPartenairePage() {
  return (
    <BureauContent title="Nouveau partenaire" description="Ajouter un nouveau partenaire">
      <Card>
        <CardContent className="pt-6">
          <PartenaireForm action={createPartenaire} submitLabel="Ajouter un partenaire" />
        </CardContent>
      </Card>
    </BureauContent>
  )
}
