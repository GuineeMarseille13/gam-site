import type { Metadata } from "next"
import { BureauContent } from "@/components/bureau/bureau-content"
import { CarouselForm } from "../_components/carousel-form"
import { createCarouselSlide } from "../_actions/actions"

export const metadata: Metadata = { title: "Nouveau slide" }

export default function NouveauSlidePage() {
  return (
    <BureauContent
      title="Nouveau slide"
      description="Ajoutez un slide au carousel principal"
      backHref="/bureau/carousel"
    >
      <div className="max-w-2xl">
        <CarouselForm action={createCarouselSlide} submitLabel="Créer le slide" />
      </div>
    </BureauContent>
  )
}
