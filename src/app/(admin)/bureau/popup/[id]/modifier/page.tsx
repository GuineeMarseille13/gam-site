import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { BureauContent } from "@/components/bureau/bureau-content"
import { Card, CardContent } from "@/components/ui/card"
import { updatePopup } from "../../_actions/actions"
import { PopupForm } from "../../_components/popup-form"

export default async function ModifierPopupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const popup = await prisma.popup.findUnique({ where: { id } })
  if (!popup) notFound()

  const action = updatePopup.bind(null, popup.id)

  return (
    <BureauContent
      title="Modifier l'annonce"
      description={popup.title ?? (popup.type === "PROSPECTUS" ? "Prospectus" : "Annonce")}
      backHref="/bureau/popup"
    >
      <Card>
        <CardContent className="pt-6">
          <PopupForm
            action={action}
            defaultValues={{
              type:          popup.type,
              isActive:      popup.isActive,
              badge:         popup.badge,
              title:         popup.title,
              subtitle:      popup.subtitle,
              description:   popup.description,
              date:          popup.date,
              location:      popup.location,
              imageId:       popup.imageId,
              ctaLabel:      popup.ctaLabel,
              ctaUrl:        popup.ctaUrl,
              prospectusIds: popup.prospectusIds,
            }}
          />
        </CardContent>
      </Card>
    </BureauContent>
  )
}
