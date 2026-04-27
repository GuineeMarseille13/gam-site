import { BureauContent } from "@/components/bureau/bureau-content"
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
    <BureauContent title="Nouvel événement" description="Créer un nouvel événement">
      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardContent className="px-6 pt-6 pb-8 sm:px-8 sm:pt-8 sm:pb-10">
          <EvenementForm
            action={createEvenement}
            defaultValues={{ startDate, endDate }}
          />
        </CardContent>
      </Card>
    </BureauContent>
  )
}
