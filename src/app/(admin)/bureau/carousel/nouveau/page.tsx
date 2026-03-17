import type { Metadata } from "next"
import { BureauDataPage } from "@/components/bureau/bureau-data-page"
import { CarouselForm } from "../_components/carousel-form"
import { createCarouselSlide } from "../_actions/actions"

export const metadata: Metadata = { title: "Nouveau slide" }

export default function NouveauSlidePage() {
  return (
    <BureauDataPage
      title="Nouveau slide"
      description="Ajoutez un slide au carousel principal"
      backHref="/bureau/carousel"
    >
      <div className="max-w-2xl">
        <CarouselForm action={createCarouselSlide} submitLabel="Créer le slide" />
      </div>
    </BureauDataPage>
  )
}
