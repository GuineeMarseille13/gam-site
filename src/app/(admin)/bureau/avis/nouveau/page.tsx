import type { Metadata } from "next"
import { BureauContent } from "@/components/bureau/bureau-content"
import { Card, CardContent } from "@/components/ui/card"
import { createAvis } from "../_actions/actions"
import { AvisForm } from "../_components/avis-form"

export const metadata: Metadata = {
  title: "Nouvel avis",
  description: "Ajouter un témoignage sur la page d’accueil",
}

export default function NouvelAvisPage() {
  return (
    <BureauContent
      title="Nouvel avis"
      description="Le témoignage apparaît sur la page d’accueil lorsque « Visible » est coché."
      backHref="/bureau/avis"
    >
      <Card>
        <CardContent className="pt-6">
          <AvisForm action={createAvis} />
        </CardContent>
      </Card>
    </BureauContent>
  )
}
