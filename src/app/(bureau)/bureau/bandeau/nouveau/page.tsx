import { BureauDataPage } from "@/components/bureau/bureau-data-page"
import { Card, CardContent } from "@/components/ui/card"
import { createBanner } from "../_actions/actions"
import { BannerForm } from "../_components/banner-form"

export default function NouveauBandeauPage() {
  return (
    <BureauDataPage
      title="Nouveau bandeau"
      description="Créer un bandeau défilant"
      backHref="/bureau/bandeau"
    >
      <Card>
        <CardContent className="pt-6">
          <BannerForm action={createBanner} />
        </CardContent>
      </Card>
    </BureauDataPage>
  )
}
