import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { BureauContent } from "@/components/bureau/bureau-content"
import { Card, CardContent } from "@/components/ui/card"
import { HerbergementRelationProfilForm } from "./_components/herbergement-relation-profil-form"
import { getProfilPageData } from "@/app/(admin)/_shared/profile/_helpers/get-profil-page-data"

export const metadata: Metadata = { title: "Mon profil" }

export default async function HerbergementRelationProfilPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/connexion-hebergement-relation")

  const defaultValues = await getProfilPageData({
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: session.user.role,
    image: session.user.image,
  })

  return (
    <BureauContent
      title="Mon profil"
      description="Gérez vos informations personnelles et la sécurité de votre compte"
    >
      <Card>
        <CardContent className="pt-6">
          <HerbergementRelationProfilForm defaultValues={defaultValues} />
        </CardContent>
      </Card>
    </BureauContent>
  )
}
