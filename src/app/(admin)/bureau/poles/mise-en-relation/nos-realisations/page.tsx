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

const POLE_SLUG = "mise-en-relation" as const

export const metadata: Metadata = {
  title: "Nos réalisations — Mise en relation",
  description: "Section « Nos réalisations » — DetailsPole",
}

export default async function MiseEnRelationNosRealisationsPage() {
  const pole = getPoleBySlug(POLE_SLUG)
  if (!pole) {
    notFound()
  }

  const dto = await getDetailsPoleBureauContentByPublicSlug(POLE_SLUG)
  const savedText = getDetailsPoleSectionStored(dto, "achievements")
  const fallbackBlurb = getStaticFallbackBlurbForSection(pole, "achievements")

  return (
    <BureauContent
      title="Nos réalisations"
      description="Texte d’introduction de la section « Nos réalisations » sur la page publique."
      backHref="/bureau/poles"
    >
      <BureauPoleDetailsPageCard>
        <PoleDetailsSectionForm
          action={saveDetailsPoleBureauSectionAction}
          poleSlug={POLE_SLUG}
          section="achievements"
          savedText={savedText}
          fallbackBlurb={fallbackBlurb}
        />
      </BureauPoleDetailsPageCard>
    </BureauContent>
  )
}
