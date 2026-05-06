import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { BureauContent } from "@/components/bureau/bureau-content"
import { getPoleBySlug } from "@/data/poles"
import { BureauPoleDetailsPageCard } from "../../_content/bureau-pole-details-page-card"
import { PoleServicesPanel } from "../../_components/pole-services-panel"

const POLE_SLUG = "demarche-administrative" as const

export const metadata: Metadata = {
  title: "Nos services — Accompagnement administratif",
  description: "Édition des cartes services dynamiques",
}

export default async function DemarcheAdministrativeNosServicesPage() {
  const pole = getPoleBySlug(POLE_SLUG)
  if (!pole) {
    notFound()
  }

  return (
    <BureauContent
      title="Nos services"
      description="Gérez les cartes services affichées sur la page publique."
      backHref="/bureau/poles"
    >
      <BureauPoleDetailsPageCard>
        <PoleServicesPanel poleSlug={POLE_SLUG} />
      </BureauPoleDetailsPageCard>
    </BureauContent>
  )
}
