import type { Metadata } from "next"
import { BureauContent } from "@/components/bureau/bureau-content"
import { Card, CardContent } from "@/components/ui/card"
import { BenevoleForm } from "../_components/benevole-form"

export const metadata: Metadata = { title: "Nouveau bénévole" }

export default function NouveauBenevolePage() {
  return (
    <BureauContent
      title="Nouveau bénévole"
      description="Ajoutez un bénévole dans la base de contacts de l'association"
    >
      <Card>
        <CardContent className="pt-6">
          <BenevoleForm mode="create" />
        </CardContent>
      </Card>
    </BureauContent>
  )
}
