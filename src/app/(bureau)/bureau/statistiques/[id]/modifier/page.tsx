import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { BureauDataPage } from "@/components/bureau/bureau-data-page"
import { Card, CardContent } from "@/components/ui/card"
import { updateStatistique } from "../../_actions/actions"
import { StatistiqueForm } from "../../_components/statistique-form"

export default async function ModifierStatistiquePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const stat = await prisma.achievement.findUnique({ where: { id } })
  if (!stat) notFound()

  const action = updateStatistique.bind(null, stat.id)

  return (
    <BureauDataPage title="Modifier la statistique" description={stat.label ?? "Statistique"}>
      <Card>
        <CardContent className="pt-6">
          <StatistiqueForm action={action} defaultValues={stat} />
        </CardContent>
      </Card>
    </BureauDataPage>
  )
}
