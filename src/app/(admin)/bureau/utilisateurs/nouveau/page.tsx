import type { Metadata } from "next"
import { BureauDataPage } from "@/components/bureau/bureau-data-page"
import { Card, CardContent } from "@/components/ui/card"
import { UserForm } from "../_components/user-form"

export const metadata: Metadata = { title: "Nouvel utilisateur" }

export default function NouvelUtilisateurPage() {
  return (
    <BureauDataPage
      title="Nouvel utilisateur"
      description="Créez un compte et définissez son rôle d'accès"
    >
      <Card className="max-w-lg">
        <CardContent className="pt-6">
          <UserForm mode="create" />
        </CardContent>
      </Card>
    </BureauDataPage>
  )
}
