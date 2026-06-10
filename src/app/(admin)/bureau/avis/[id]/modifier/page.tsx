import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { BureauContent } from "@/components/bureau/bureau-content"
import { Card, CardContent } from "@/components/ui/card"
import { updateAvis } from "../../_actions/actions"
import { AvisForm } from "../../_components/avis-form"
import { avisIdParamsSchema } from "../../_schemas/avis-params.schema"
import { inferAvisSourceType } from "../../_schemas/avis-source.schema"

export const metadata: Metadata = {
  title: "Modifier un avis",
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ModifierAvisPage({ params }: PageProps) {
  const { id } = avisIdParamsSchema.parse(await params)
  const review = await prisma.review.findUnique({
    where: { id },
  })

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
            defaultValues={{
              firstName: review.firstName,
              lastName: review.lastName,
              body: review.body,
              rating: review.rating,
              order: review.order,
              isActive: review.isActive,
              isVerified: review.isVerified,
              avatarUrl: review.avatarUrl,
              sourceType: inferAvisSourceType(review.sourceLabel, review.sourceImageUrl),
              sourceLabel: review.sourceLabel,
              sourceImageUrl: review.sourceImageUrl,
            }}
          />
        </CardContent>
      </Card>
    </BureauContent>
  )
}
