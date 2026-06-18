import type { Metadata } from "next"
import { IconMessageCircle } from "@tabler/icons-react"

import { BureauContent } from "@/components/bureau/bureau-content"
import {
  getAssociationContentByKey,
  getPresidentIdentity,
} from "@/helpers/association-content/queries"
import { ASSOCIATION_CONTENT_KEYS } from "@/helpers/association-content/_schemas/association-content.schema"

import { savePresidentContentAction } from "../_actions/save-association-content"
import { AssociationPublicPreviewLink } from "../_components/association-public-preview-link"
import { AssociationSectionNav } from "../_components/association-section-nav"
import { AssociationTextImageForm } from "../_components/association-text-image-form"
import { BureauAssociationPageCard } from "../_components/bureau-association-page-card"

export const metadata: Metadata = {
  title: "Le Président — Notre association",
  description: "Modifier le mot du président et la photo affichée sur le site public",
}

/**
 * Édition du contenu « Le Président » (onglet Notre association).
 */
export default async function BureauAssociationPresidentPage() {
  const [content] = await Promise.all([
    getAssociationContentByKey(ASSOCIATION_CONTENT_KEYS.president),
    getPresidentIdentity(),
  ])

  const savedText = content?.body?.trim() ?? ""

  return (
    <BureauContent
      title="Le Président"
      description="Gérez la photo et le message affichés dans l'onglet « Le Président » de la page Notre association."
      backHref="/bureau"
      actions={<AssociationPublicPreviewLink tab="president" />}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <AssociationSectionNav />

        <BureauAssociationPageCard
          title="Mot du président"
          description="Photo de la carte « Fondateur & Président » et texte du message, synchronisés avec le site public."
          icon={IconMessageCircle}
        >
          <AssociationTextImageForm
            action={savePresidentContentAction}
            savedText={savedText}
            savedImageId={content?.imageId}
            textLabel="Message du président"
            textHelper="Rédigez le discours tel qu'il apparaîtra sur le site. Utilisez la barre d'outils pour le gras, l'italique et les listes."
            imageLabel="Photo — Fondateur & Président"
            imageHelper="Format portrait recommandé. Cette image alimente la carte photo sur le site."
            layout="split"
            imageVariant="portrait"
          />
        </BureauAssociationPageCard>
      </div>
    </BureauContent>
  )
}
