import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { BureauDataPage } from "@/components/bureau/bureau-data-page"
import { Card, CardContent } from "@/components/ui/card"
import { updateEvenement } from "../../_actions/actions"
import { EvenementForm } from "../../_components/evenement-form"

export default async function ModifierEvenementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = await prisma.event.findUnique({ where: { id } })
  if (!event) notFound()

  const action = updateEvenement.bind(null, event.id)

  return (
    <BureauDataPage title="Modifier l'événement" description={event.title}>
      <Card>
        <CardContent className="pt-6">
          <EvenementForm action={action} defaultValues={event} />
        </CardContent>
      </Card>
    </BureauDataPage>
  )
}
