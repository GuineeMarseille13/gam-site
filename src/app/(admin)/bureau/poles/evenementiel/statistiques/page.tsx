import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { BureauContent } from "@/components/bureau/bureau-content"
import { getPoleBySlug } from "@/data/poles"
import {
  getDetailsPoleBureauContentByPublicSlug,
  getDetailsPoleSectionStored,
} from "@/helpers/details-pole-bureau/queries"
import { getStaticFallbackBlurbForSection } from "@/helpers/details-pole-bureau/static-fallback-blurb"

import { saveDetailsPoleBureauSectionAction } from "../../_actions/save-details-pole-bureau-section"
import { BureauPoleDetailsPageCard } from "../../_content/bureau-pole-details-page-card"
import { PoleDetailsSectionForm } from "../../_content/pole-details-section-form"

const POLE_SLUG = "evenementiel" as const

export const metadata: Metadata = {
  title: "Statistiques — Événementiel",
  description: "Section « Statistiques » — DetailsPole",
}

export default async function EvenementielStatistiquesPage() {
  const pole = getPoleBySlug(POLE_SLUG)
  if (!pole) {
    notFound()
  }

  const dto = await getDetailsPoleBureauContentByPublicSlug(POLE_SLUG)
  const savedText = getDetailsPoleSectionStored(dto, "statistics")
  const fallbackBlurb = getStaticFallbackBlurbForSection(pole, "statistics")

  return (
    <BureauContent
      title="Statistiques"
      description="Texte libre sous le titre « Statistiques » sur la page publique."
      backHref="/bureau/poles"
    >
      <BureauPoleDetailsPageCard>
        <PoleDetailsSectionForm
          action={saveDetailsPoleBureauSectionAction}
          poleSlug={POLE_SLUG}
          section="statistics"
          savedText={savedText}
          fallbackBlurb={fallbackBlurb}
        />
      </BureauPoleDetailsPageCard>
    </BureauContent>
  )
}
