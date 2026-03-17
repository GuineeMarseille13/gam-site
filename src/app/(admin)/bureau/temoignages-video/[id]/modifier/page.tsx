import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { BureauDataPage } from "@/components/bureau/bureau-data-page"
import { Card, CardContent } from "@/components/ui/card"
import { updateVideoTemoignage } from "../../_actions/actions"
import { VideoTemoignageForm } from "../../_components/video-temoignage-form"

export default async function ModifierVideoTemoignagePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const video = await prisma.video.findUnique({ where: { id } })
  if (!video) notFound()

  const action = updateVideoTemoignage.bind(null, video.id)

  return (
    <BureauDataPage
      title="Modifier le témoignage vidéo"
      description={video.title ?? video.url}
    >
      <Card>
        <CardContent className="pt-6">
          <VideoTemoignageForm action={action} defaultValues={video} />
        </CardContent>
      </Card>
    </BureauDataPage>
  )
}
