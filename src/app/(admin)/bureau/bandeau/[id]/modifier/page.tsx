import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { BureauDataPage } from "@/components/bureau/bureau-data-page"
import { Card, CardContent } from "@/components/ui/card"
import { updateBanner } from "../../_actions/actions"
import { BannerForm } from "../../_components/banner-form"

export default async function ModifierBandeauPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const banner = await prisma.banner.findUnique({ where: { id } })
  if (!banner) notFound()

  const action = updateBanner.bind(null, banner.id)

  return (
    <BureauDataPage
      title="Modifier le bandeau"
      description={banner.title}
      backHref="/bureau/bandeau"
    >
      <Card>
        <CardContent className="pt-6">
          <BannerForm
            action={action}
            defaultValues={{
              isActive: banner.isActive,
              badge:    banner.badge,
              title:    banner.title,
              date:     banner.date,
              location: banner.location,
            }}
          />
        </CardContent>
      </Card>
    </BureauDataPage>
  )
}
