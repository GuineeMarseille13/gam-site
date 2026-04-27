import type { Metadata } from "next"
import { BureauContent } from "@/components/bureau/bureau-content"
import { Card, CardContent } from "@/components/ui/card"
import { UserForm } from "../_components/user-form"
import { createUser } from "../_actions/actions"

export const metadata: Metadata = { title: "Nouvel utilisateur" }

export default function NouvelUtilisateurPage() {
  return (
    <BureauContent
      title="Nouveau compte d'accès"
      description="Créez un compte admin ou bureau avec accès au dashboard"
    >
      <Card>
        <CardContent className="pt-6">
          <UserForm mode="create" createAction={createUser} />
        </CardContent>
      </Card>
    </BureauContent>
  )
}
