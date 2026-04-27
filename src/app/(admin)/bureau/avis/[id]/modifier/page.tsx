import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { BureauContent } from "@/components/bureau/bureau-content"
import { Card, CardContent } from "@/components/ui/card"
import { updateAvis } from "../../_actions/actions"
import { AvisForm } from "../../_components/avis-form"
import { avisIdParamsSchema } from "../../_schemas/avis-params.schema"

export const metadata: Metadata = {
  title: "Modifier un avis",
}

interface PageProps {
  params: Promise<{ id: string }>
}

async function getRoles() {
  return prisma.role.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    select: { code: true, labelFr: true },
  })
}

export default async function ModifierAvisPage({ params }: PageProps) {
  const { id } = avisIdParamsSchema.parse(await params)
  const [review, roles] = await Promise.all([
    prisma.review.findUnique({
      where: { id },
      include: { role: { select: { code: true } } },
    }),
    getRoles(),
  ])

  if (!review) {
    notFound()
  }

  return (
    <BureauContent
      title="Modifier l’avis"
      description={`${review.firstName} ${review.lastName}`}
      backHref="/bureau/avis"
    >
      <Card>
        <CardContent className="pt-6">
          <AvisForm
            action={updateAvis.bind(null, id)}
            roles={roles}
            defaultValues={{
              firstName: review.firstName,
              lastName: review.lastName,
              roleCode: review.role.code,
              body: review.body,
              country: review.country,
              rating: review.rating,
              order: review.order,
              isActive: review.isActive,
              isVerified: review.isVerified,
              avatarUrl: review.avatarUrl,
            }}
          />
        </CardContent>
      </Card>
    </BureauContent>
  )
}
