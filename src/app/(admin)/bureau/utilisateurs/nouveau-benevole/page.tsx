import type { Metadata } from "next"
import { BureauDataPage } from "@/components/bureau/bureau-data-page"
import { Card, CardContent } from "@/components/ui/card"
import { BenevoleForm } from "../_components/benevole-form"

export const metadata: Metadata = { title: "Nouveau bénévole" }

export default function NouveauBenevolePage() {
  return (
    <BureauDataPage
      title="Nouveau bénévole"
      description="Ajoutez un bénévole dans la base de contacts de l'association"
    >
      <Card className="max-w-lg">
        <CardContent className="pt-6">
          <BenevoleForm />
        </CardContent>
      </Card>
    </BureauDataPage>
  )
}
