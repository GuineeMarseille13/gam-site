import { BureauContent } from "@/components/bureau/bureau-content"
import { Card, CardContent } from "@/components/ui/card"
import { administrationCardClassName } from "@/config/administration-dashboard-theme"
import { createBenevole } from "@/app/(admin)/bureau/benevoles/_actions/actions"
import { BenevoleForm } from "@/app/(admin)/bureau/benevoles/_components/benevole-form"

export default function AdministrationNouveauBenevolePage() {
  return (
    <BureauContent
      title="Nouveau bénévole"
      description="Ajouter un bénévole à l'équipe"
      dashboard="administration"
    >
      <Card className={administrationCardClassName}>
        <CardContent className="pt-6">
          <BenevoleForm
            action={createBenevole}
            submitLabel="Ajouter un bénévole"
            dashboardBase="/administration"
          />
        </CardContent>
      </Card>
    </BureauContent>
  )
}
