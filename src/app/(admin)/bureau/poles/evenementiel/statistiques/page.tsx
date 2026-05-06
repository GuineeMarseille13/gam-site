import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { BureauContent } from "@/components/bureau/bureau-content"
import { getPoleBySlug } from "@/data/poles"

import { BureauPoleDetailsPageCard } from "../../_content/bureau-pole-details-page-card"
import { PoleStatsPanel } from "../../_components/pole-stats-panel"

const POLE_SLUG = "evenementiel" as const

export const metadata: Metadata = {
  title: "Statistiques — Événementiel",
  description: "Édition des cartes statistiques dynamiques",
}

export default async function EvenementielStatistiquesPage() {
  const pole = getPoleBySlug(POLE_SLUG)
  if (!pole) {
    notFound()
  }

  return (
    <BureauContent
      title="Statistiques"
      description="Gérez les cartes statistiques affichées sur la page publique."
      backHref="/bureau/poles"
    >
      <BureauPoleDetailsPageCard>
        <PoleStatsPanel poleSlug={POLE_SLUG} />
      </BureauPoleDetailsPageCard>
    </BureauContent>
  )
}
