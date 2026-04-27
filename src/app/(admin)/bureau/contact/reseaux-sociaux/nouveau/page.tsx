import { BureauContent } from "@/components/bureau/bureau-content"
import { Card, CardContent } from "@/components/ui/card"
import { createSocialMedia } from "../../_actions/actions"
import { SocialMediaForm } from "../../_components/social-media-form"

export default function NouveauReseauSocialPage() {
  return (
    <BureauContent title="Nouveau réseau social" description="Ajouter un réseau social affiché sur la page contact">
      <Card>
        <CardContent className="pt-6">
          <SocialMediaForm action={createSocialMedia} />
        </CardContent>
      </Card>
    </BureauContent>
  )
}
