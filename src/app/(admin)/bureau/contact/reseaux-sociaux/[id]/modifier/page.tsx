import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { BureauContent } from "@/components/bureau/bureau-content"
import { Card, CardContent } from "@/components/ui/card"
import { updateSocialMedia } from "../../../_actions/actions"
import { SocialMediaForm } from "../../../_components/social-media-form"

export default async function ModifierReseauSocialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const sm = await prisma.socialMedia.findUnique({ where: { id } })
  if (!sm) notFound()

  const action = updateSocialMedia.bind(null, sm.id)

  return (
    <BureauContent title="Modifier le réseau social" description={sm.name}>
      <Card>
        <CardContent className="pt-6">
          <SocialMediaForm action={action} defaultValues={sm} />
        </CardContent>
      </Card>
    </BureauContent>
  )
}
