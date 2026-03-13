import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { BureauDataPage } from "@/components/bureau/bureau-data-page"
import { Card, CardContent } from "@/components/ui/card"
import { updatePole } from "../../_actions/actions"
import { PoleForm } from "../../_components/pole-form"

export default async function ModifierPolePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const pole = await prisma.pole.findUnique({ where: { id } })
  if (!pole) notFound()

  const action = updatePole.bind(null, pole.id)

  return (
    <BureauDataPage title="Modifier le pôle" description={pole.name}>
      <Card>
        <CardContent className="pt-6">
          <PoleForm action={action} defaultValues={pole} />
        </CardContent>
      </Card>
    </BureauDataPage>
  )
}
