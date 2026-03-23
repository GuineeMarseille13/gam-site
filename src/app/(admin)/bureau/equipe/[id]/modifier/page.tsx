import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { BureauDataPage } from "@/components/bureau/bureau-data-page"
import { Card, CardContent } from "@/components/ui/card"
import { updateMembreEquipe, changePasswordEquipe } from "../../_actions/actions"
import { EquipeForm } from "../../_components/equipe-form"

export default async function ModifierMembrePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const member = await prisma.teamMember.findUnique({ where: { id } })
  if (!member) notFound()

  const person = await prisma.person.findUnique({ where: { id: member.personId } })
  if (!person) notFound()

  const linkedUser = person.userId
    ? await prisma.user.findUnique({ where: { id: person.userId } })
    : null

  return (
    <BureauDataPage title="Modifier le membre" description={`${person.firstName} ${person.lastName}`}>
      <Card>
        <CardContent className="pt-6">
          <EquipeForm
            mode="edit"
            updateAction={updateMembreEquipe.bind(null, member.id)}
            changePasswordAction={person.userId ? changePasswordEquipe.bind(null, person.userId) : undefined}
            defaultValues={{
              firstName:   person.firstName,
              lastName:    person.lastName,
              email:       person.email,
              phone:       person.phone,
              poste:       member.poste,
              role:        linkedUser?.role ?? "bureau",
              description: member.description,
              imageId:     member.imageId,
              order:       member.order,
              showOnSite:  member.showOnSite,
              userId:      person.userId,
            }}
          />
        </CardContent>
      </Card>
    </BureauDataPage>
  )
}
