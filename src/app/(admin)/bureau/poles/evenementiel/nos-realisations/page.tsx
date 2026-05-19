import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { BureauContent } from "@/components/bureau/bureau-content"
import {
  getBureauPoleAchievementsPageDescription,
  getBureauPoleAchievementsPageMetaTitle,
} from "@/config/bureau-pole-achievements-ui"
import { getPoleBySlug } from "@/data/poles"
import {
  getDetailsPoleBureauContentByPublicSlug,
  getDetailsPoleSectionStored,
} from "@/helpers/details-pole-bureau/queries"

import { saveDetailsPoleBureauSectionAction } from "../../_actions/save-details-pole-bureau-section"
import { BureauPoleDetailsPageCard } from "../../_content/bureau-pole-details-page-card"
import { PoleDetailsSectionForm } from "../../_content/pole-details-section-form"
import { PoleAchievementsPanel } from "../../_components/pole-achievements-panel"

const POLE_SLUG = "evenementiel" as const

export const metadata: Metadata = {
  title: getBureauPoleAchievementsPageMetaTitle(POLE_SLUG),
  description: getBureauPoleAchievementsPageDescription(POLE_SLUG),
}

export default async function EvenementielNosRealisationsPage() {
  const pole = getPoleBySlug(POLE_SLUG)
  if (!pole) {
    notFound()
  }

  const dto = await getDetailsPoleBureauContentByPublicSlug(POLE_SLUG)
  const savedText = getDetailsPoleSectionStored(dto, "achievements")

  return (
    <BureauContent
      title="Nos réalisations"
      description={getBureauPoleAchievementsPageDescription(POLE_SLUG)}
      backHref="/bureau/poles"
    >
      <div className="flex flex-col gap-6">
        <BureauPoleDetailsPageCard>
          <PoleDetailsSectionForm
            action={saveDetailsPoleBureauSectionAction}
            poleSlug={POLE_SLUG}
            section="achievements"
            savedText={savedText}
          />
        </BureauPoleDetailsPageCard>

        <BureauPoleDetailsPageCard>
          <PoleAchievementsPanel poleSlug={POLE_SLUG} />
        </BureauPoleDetailsPageCard>
      </div>
    </BureauContent>
  )
}
