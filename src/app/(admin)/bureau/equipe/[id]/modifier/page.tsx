import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { BureauDataPage } from "@/components/bureau/bureau-data-page"
import { Card, CardContent } from "@/components/ui/card"
import { updateMembreEquipe } from "../../_actions/actions"
import { EquipeForm } from "../../_components/equipe-form"

export default async function ModifierMembrePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const member = await prisma.teamMember.findUnique({ where: { id } })
  if (!member) notFound()

  const person = await prisma.person.findUnique({ where: { id: member.personId } })
  if (!person) notFound()

  const action = updateMembreEquipe.bind(null, member.id)

  return (
    <BureauDataPage title="Modifier le membre" description={`${person.firstName} ${person.lastName}`}>
      <Card>
        <CardContent className="pt-6">
          <EquipeForm
            action={action}
            defaultValues={{
              firstName: person.firstName,
              lastName: person.lastName,
              email: person.email,
              phone: person.phone,
              poste: member.poste,
              description: member.description,
              imageId: member.imageId,
              order: member.order,
              showOnSite: member.showOnSite,
            }}
          />
        </CardContent>
      </Card>
    </BureauDataPage>
  )
}
