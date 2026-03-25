import { BureauDataPage } from "@/components/bureau/bureau-data-page"
import { Card, CardContent } from "@/components/ui/card"
import { createBenevole } from "@/app/(admin)/bureau/benevoles/_actions/actions"
import { BenevoleForm } from "@/app/(admin)/bureau/benevoles/_components/benevole-form"

export default function AdministrationNouveauBenevolePage() {
  return (
    <BureauDataPage title="Nouveau bénévole" description="Ajouter un bénévole à l'équipe">
      <Card>
        <CardContent className="pt-6">
          <BenevoleForm
            action={createBenevole}
            submitLabel="Ajouter un bénévole"
            dashboardBase="/administration"
          />
        </CardContent>
      </Card>
    </BureauDataPage>
  )
}
