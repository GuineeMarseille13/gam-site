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

const POLE_SLUG = "demarche-administrative" as const

export const metadata: Metadata = {
  title: "À propos — Accompagnement administratif",
  description:
    "Modifier le texte « À propos » affiché sur la page publique du pôle démarche administrative",
}

export default async function DemarcheAdministrativeTitrePage() {
  const pole = getPoleBySlug(POLE_SLUG)
  if (!pole) {
    notFound()
  }

  const dto = await getDetailsPoleBureauContentByPublicSlug(POLE_SLUG)
  const savedText = getDetailsPoleSectionStored(dto, "about")

  return (
    <BureauContent
      title="Texte « À propos »"
      description="Texte affiché sur la page publique du pôle démarche administrative"
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
