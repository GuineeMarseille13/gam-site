import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { BureauDataPage } from "@/components/bureau/bureau-data-page"
import { Card, CardContent } from "@/components/ui/card"
import { updateEvenement } from "../../_actions/actions"
import { EvenementForm } from "../../_components/evenement-form"

export default async function ModifierEvenementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const event = await prisma.event.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  })
  if (!event) notFound()

  // Rétro-compatibilité : si pas encore de EventImage mais imageId existe
  const imageIds = event.images.length > 0
    ? event.images.map((i) => i.imageId)
    : (event.imageId ? [event.imageId] : [])

  const action = updateEvenement.bind(null, event.id)

  return (
    <BureauDataPage title="Modifier l'événement" description={event.title}>
      <Card>
        <CardContent className="pt-6">
          <EvenementForm
            action={action}
            defaultValues={{
              title:       event.title,
              description: event.description,
              location:    event.location,
              startDate:   event.startDate,
              endDate:     event.endDate,
              published:   event.published,
              imageIds,
            }}
          />
        </CardContent>
      </Card>
    </BureauDataPage>
  )
}
