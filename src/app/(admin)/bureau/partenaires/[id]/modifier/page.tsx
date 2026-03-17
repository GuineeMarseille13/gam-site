import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { BureauDataPage } from "@/components/bureau/bureau-data-page"
import { Card, CardContent } from "@/components/ui/card"
import { updatePartenaire } from "../../_actions/actions"
import { PartenaireForm } from "../../_components/partenaire-form"

export default async function ModifierPartenairePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const partner = await prisma.partner.findUnique({ where: { id } })
  if (!partner) notFound()

  const action = updatePartenaire.bind(null, partner.id)

  return (
    <BureauDataPage title="Modifier le partenaire" description={partner.name}>
      <Card>
        <CardContent className="pt-6">
          <PartenaireForm action={action} defaultValues={partner} />
        </CardContent>
      </Card>
    </BureauDataPage>
  )
}
