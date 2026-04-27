import { BureauContent } from "@/components/bureau/bureau-content"
import { Card, CardContent } from "@/components/ui/card"
import { createPole } from "../_actions/actions"
import { PoleForm } from "../_components/pole-form"

export default function NouveauPolePage() {
  return (
    <BureauContent title="Nouveau pôle" description="Créer un nouveau pôle d'activité">
      <Card>
        <CardContent className="pt-6">
          <PoleForm action={createPole} />
        </CardContent>
      </Card>
    </BureauContent>
  )
}
