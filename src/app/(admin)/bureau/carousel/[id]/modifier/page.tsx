import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { BureauDataPage } from "@/components/bureau/bureau-data-page"
import { CarouselForm } from "../../_components/carousel-form"
import { updateCarouselSlide } from "../../_actions/actions"

export const metadata: Metadata = { title: "Modifier le slide" }

export default async function ModifierSlidePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const slide = await prisma.image.findFirst({
    where: { id, page: "HOME", section: "CAROUSEL" },
  })

  if (!slide) notFound()

  const boundAction = updateCarouselSlide.bind(null, slide.id)

  return (
    <BureauDataPage
      title="Modifier le slide"
      description={slide.title ?? "Sans titre"}
      backHref="/bureau/carousel"
    >
      <div className="max-w-2xl">
        <CarouselForm
          slide={{
            id:          slide.id,
            url:         slide.url,
            title:       slide.title ?? null,
            description: slide.description ?? null,
            order:       slide.order ?? 0,
            isActive:    slide.isActive,
          }}
          action={boundAction}
          submitLabel="Enregistrer les modifications"
        />
      </div>
    </BureauDataPage>
  )
}
