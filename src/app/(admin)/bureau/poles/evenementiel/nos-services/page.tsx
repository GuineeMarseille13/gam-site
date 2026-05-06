import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { BureauContent } from "@/components/bureau/bureau-content"
import { getPoleBySlug } from "@/data/poles"
import {
  getDetailsPoleBureauContentByPublicSlug,
  getDetailsPoleSectionStored,
} from "@/helpers/details-pole-bureau/queries"

import { saveDetailsPoleBureauSectionAction } from "../../_actions/save-details-pole-bureau-section"
import { BureauPoleDetailsPageCard } from "../../_content/bureau-pole-details-page-card"
import { PoleDetailsSectionForm } from "../../_content/pole-details-section-form"

const POLE_SLUG = "evenementiel" as const

export const metadata: Metadata = {
  title: "Nos services — Événementiel",
  description: "Section « Nos services » — DetailsPole",
}

export default async function EvenementielNosServicesPage() {
  const pole = getPoleBySlug(POLE_SLUG)
  if (!pole) {
    notFound()
  }

  const dto = await getDetailsPoleBureauContentByPublicSlug(POLE_SLUG)
  const savedText = getDetailsPoleSectionStored(dto, "services")

  return (
    <BureauContent
      title="Nos services"
      description="Texte libre affiché au-dessus des cartes « Nos services » sur la page publique."
      backHref="/bureau/poles"
    >
      <BureauPoleDetailsPageCard>
        <PoleDetailsSectionForm
          action={saveDetailsPoleBureauSectionAction}
          poleSlug={POLE_SLUG}
          section="services"
          savedText={savedText}
        />
      </BureauPoleDetailsPageCard>
    </BureauContent>
  )
}
