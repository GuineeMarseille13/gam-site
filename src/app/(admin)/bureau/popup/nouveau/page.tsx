import type { Metadata } from "next"
import { BureauContent } from "@/components/bureau/bureau-content"
import { Card, CardContent } from "@/components/ui/card"
import { createPopup } from "../_actions/actions"
import { PopupForm } from "../_components/popup-form"

export const metadata: Metadata = { title: "Nouvelle annonce" }

export default function NouveauPopupPage() {
  return (
    <BureauContent
      title="Nouvelle annonce"
      description="Créez un popup ou prospectus à afficher sur le site"
      backHref="/bureau/popup"
    >
      <Card>
        <CardContent className="pt-6">
          <PopupForm action={createPopup} />
        </CardContent>
      </Card>
    </BureauContent>
  )
}
