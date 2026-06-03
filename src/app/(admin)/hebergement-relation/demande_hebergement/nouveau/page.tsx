// src/app/(bureau)/hebergement-relation/demande_hebergement/nouveau/page.tsx

import { BureauContent } from "@/components/bureau/bureau-content"
import { Card, CardContent } from "@/components/ui/card"
import { createDemande } from "../actions/demande_actions"
import { DemandeForm } from "../components/demandeForm"

export default function NouvelleDemandePage() {
  return (
    <BureauContent
      title="Nouvelle demande d'hébergement"
      description="Renseigner les informations du demandeur"
    >
      <Card>
        <CardContent className="pt-6">
          <DemandeForm
            action={createDemande}
            submitLabel="Créer la demande"
            cancelHref="/hebergement-relation/demande_hebergement"
            isCreating={true}
            
            // * Pas de defaultValues → statut sera forcé EN_ATTENTE côté serveur *

          />
        </CardContent>
      </Card>
    </BureauContent>
  )
}