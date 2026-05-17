import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { BureauContent } from "@/components/bureau/bureau-content"
import { Card, CardContent } from "@/components/ui/card"
import { updateMembreEquipe } from "../../_actions/actions"
import { EquipeForm } from "../../_components/equipe-form"

export default async function ModifierMembrePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const member = await prisma.teamMember.findUnique({ where: { id } })
  if (!member) notFound()

  const person = await prisma.person.findUnique({
    where: { id: member.personId },
    include: { poste: true },
  })
  if (!person) notFound()

  return (
    <BureauContent title="Modifier le membre" description={`${person.firstName} ${person.lastName}`}>
      <Card>
        <CardContent className="pt-6">
          <EquipeForm
            mode="edit"
            updateAction={updateMembreEquipe.bind(null, member.id)}
            defaultValues={{
              firstName:   person.firstName,
              lastName:    person.lastName,
              email:       person.email,
              phone:       person.phone,
              posteCode: person.poste?.code ?? "",
              description: member.description,
              imageId:     member.imageId,
              order:       member.order,
              showOnSite:  member.showOnSite,
              userId:      person.userId,
            }}
          />
        </CardContent>
      </Card>
    </BureauContent>
  )
}
