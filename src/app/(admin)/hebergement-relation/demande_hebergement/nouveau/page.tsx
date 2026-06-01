import { BureauContent } from "@/components/bureau/bureau-content"
import { Card, CardContent } from "@/components/ui/card"

import { DemandeForm } from "../components/demandeForm"
import { createDemande } from "../actions/demande_actions"

export default function NouvelleDemandePage() {
  return (
    <BureauContent
      title="Nouvelle demande"
      description="Créer une demande d'hébergement manuellement"
    >
      <Card>
        <CardContent className="pt-6">
          <DemandeForm
            action={createDemande}
            submitLabel="Faire une demande"
            cancelHref="/hebergement-relation/demande_hebergement"
          />
        </CardContent>
      </Card>
    </BureauContent>
  )
}