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
  title: "À propos — Mise en relation",
  description: "Modifier le texte « À propos » sur la page publique du pôle mise en relation",
}

export default async function MiseEnRelationTitrePage() {
  const pole = getPoleBySlug(POLE_SLUG)
  if (!pole) {
    notFound()
  }

  const dto = await getDetailsPoleBureauContentByPublicSlug(POLE_SLUG)
  const savedText = getDetailsPoleSectionStored(dto, "about")
  const fallbackBlurb = getStaticFallbackBlurbForSection(pole, "about")

  return (
    <BureauContent
      title="Texte « À propos »"
      description="Texte affiché sur la page publique du pôle mise en relation"
      backHref="/bureau/poles"
    >
      <BureauPoleDetailsPageCard>
        <PoleDetailsSectionForm
          action={saveDetailsPoleBureauSectionAction}
          poleSlug={POLE_SLUG}
          section="about"
          savedText={savedText}
        />
      </BureauPoleDetailsPageCard>
    </BureauContent>
  )
}
