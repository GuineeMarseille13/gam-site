import { BureauDataPage } from "@/components/bureau/bureau-data-page"
import { Card, CardContent } from "@/components/ui/card"
import { createEvenement } from "../_actions/actions"
import { EvenementForm } from "../_components/evenement-form"

function getDefaultDates() {
  const start = new Date()
  start.setMinutes(0, 0, 0)
  const end = new Date(start)
  end.setHours(end.getHours() + 2)
  return { startDate: start, endDate: end }
}

export default function NouvelEvenementPage() {
  const { startDate, endDate } = getDefaultDates()
  return (
    <BureauDataPage title="Nouvel événement" description="Créer un nouvel événement">
      <Card>
        <CardContent className="pt-6">
          <EvenementForm
            action={createEvenement}
            defaultValues={{ startDate, endDate }}
          />
        </CardContent>
      </Card>
    </BureauDataPage>
  )
}
