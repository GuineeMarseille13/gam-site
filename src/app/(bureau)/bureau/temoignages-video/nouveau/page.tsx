import { prisma } from "@/lib/prisma"
import { BureauDataPage } from "@/components/bureau/bureau-data-page"
import { Card, CardContent } from "@/components/ui/card"
import { createVideoTemoignage } from "../_actions/actions"
import { VideoTemoignageForm } from "../_components/video-temoignage-form"

async function getNextOrder(): Promise<number> {
  const last = await prisma.video.findFirst({
    where: { page: "HOME", section: "REVIEW" },
    orderBy: { order: "desc" },
    select: { order: true },
  })
  return (last?.order ?? 0) + 1
}

export default async function NouveauVideoTemoignagePage() {
  const nextOrder = await getNextOrder()

  return (
    <BureauDataPage title="Nouveau témoignage vidéo" description="Ajouter une vidéo à la section témoignages">
      <Card>
        <CardContent className="pt-6">
          <VideoTemoignageForm action={createVideoTemoignage} defaultValues={{ order: nextOrder }} />
        </CardContent>
      </Card>
    </BureauDataPage>
  )
}
