import { BureauDataPage } from "@/components/bureau/bureau-data-page"
import { Card, CardContent } from "@/components/ui/card"
import { createEvenement } from "../_actions/actions"
import { EvenementForm } from "../_components/evenement-form"

export default function NouvelEvenementPage() {
  return (
    <BureauDataPage title="Nouvel événement" description="Créer un nouvel événement">
      <Card>
        <CardContent className="pt-6">
          <EvenementForm action={createEvenement} />
        </CardContent>
      </Card>
    </BureauDataPage>
  )
}
