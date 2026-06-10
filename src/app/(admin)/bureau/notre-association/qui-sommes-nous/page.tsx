import type { Metadata } from "next"
import { IconBulb, IconUsers } from "@tabler/icons-react"

import { BureauContent } from "@/components/bureau/bureau-content"
import { getAssociationContentMap } from "@/helpers/association-content/queries"
import { ASSOCIATION_CONTENT_KEYS } from "@/helpers/association-content/_schemas/association-content.schema"

import {
  saveWhatWeOfferContentAction,
  saveWhoWeAreContentAction,
} from "../_actions/save-association-content"
import { AssociationPublicPreviewLink } from "../_components/association-public-preview-link"
import { AssociationSectionNav } from "../_components/association-section-nav"
import { AssociationTextImageForm } from "../_components/association-text-image-form"
import { BureauAssociationPageCard } from "../_components/bureau-association-page-card"
import { WhatWeOfferForm } from "../_components/what-we-offer-form"

export const metadata: Metadata = {
  title: "Qui sommes-nous ? — Notre association",
  description: "Modifier les sections Qui sommes-nous et Que propose l'association",
}

/**
 * Édition du contenu « Qui sommes-nous ? » (onglet Notre association).
 */
export default async function BureauAssociationQuiSommesNousPage() {
  const map = await getAssociationContentMap()
  const whoWeAre = map[ASSOCIATION_CONTENT_KEYS.whoWeAre]
  const whatWeOffer = map[ASSOCIATION_CONTENT_KEYS.whatWeOffer]

  return (
    <BureauContent
      title="Qui sommes-nous ?"
      description="Présentation de l'association et de ses axes d'action, synchronisées avec le site public."
      backHref="/bureau"
      actions={<AssociationPublicPreviewLink tab="about" />}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <AssociationSectionNav />

        <BureauAssociationPageCard
          title="Qui sommes-nous ?"
          description="Image et texte de présentation de l'association."
          icon={IconUsers}
        >
          <AssociationTextImageForm
            action={saveWhoWeAreContentAction}
            savedTitle={whoWeAre?.title?.trim() ?? ""}
            savedText={whoWeAre?.body?.trim() ?? ""}
            savedImageId={whoWeAre?.imageId}
            showTitle
            titleLabel="Titre de la section"
            textLabel="Texte de présentation"
            textHelper="Décrivez l'origine et la mission de l'association. Séparez les paragraphes par une ligne vide."
            imageLabel="Image illustrative"
            imageHelper="Format paysage recommandé pour la section « Qui sommes-nous ? »."
            layout="split"
            imageVariant="landscape"
          />
        </BureauAssociationPageCard>

        <BureauAssociationPageCard
          title="Que propose l'association ?"
          description="Introduction, axes majeurs, conclusion et visuel de la section activités."
          icon={IconBulb}
        >
          <WhatWeOfferForm
            action={saveWhatWeOfferContentAction}
            savedTitle={whatWeOffer?.title?.trim() ?? ""}
            savedIntro={whatWeOffer?.intro?.trim() ?? ""}
            savedItems={whatWeOffer?.items ?? [""]}
            savedConclusion={whatWeOffer?.conclusion?.trim() ?? ""}
            savedImageId={whatWeOffer?.imageId}
          />
        </BureauAssociationPageCard>
      </div>
    </BureauContent>
  )
}
