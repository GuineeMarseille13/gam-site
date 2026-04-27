import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { BureauContent } from "@/components/bureau/bureau-content"
import { Card, CardContent } from "@/components/ui/card"
import { ProfilForm } from "./_components/profil-form"
import { updateProfil, changeOwnPassword } from "./_actions/actions"
import { cloudinaryImageUrl } from "@/lib/cloudinary-delivery"

export const metadata: Metadata = { title: "Mon profil" }

export default async function ProfilPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/connexion")

  const userId = session.user.id

  // Récupérer la Person + le TeamMember liés si ils existent
  const person = await prisma.person.findUnique({
    where: { userId },
    include: { role: true },
  })
  const teamMember = person
    ? await prisma.teamMember.findUnique({ where: { personId: person.id } })
    : null

  // Résoudre l'image : person.image (URL) prioritaire sur user.image
  const imageFromTeamMember = teamMember?.imageId
    ? cloudinaryImageUrl(teamMember.imageId, "w_400,h_400,c_fill,q_auto,f_auto")
    : null
  const resolvedImage = person?.image ?? imageFromTeamMember ?? session.user.image ?? null

  // Décomposer le nom si pas de Person liée
  const nameParts = session.user.name.split(" ")
  const fallbackFirst = nameParts[0]  ?? ""
  const fallbackLast  = nameParts.slice(1).join(" ") || ""

  return (
    <BureauContent
      title="Mon profil"
      description="Gérez vos informations personnelles et la sécurité de votre compte"
    >
      <Card>
        <CardContent className="pt-6">
          <ProfilForm
            defaultValues={{
              firstName: person?.firstName ?? fallbackFirst,
              lastName:  person?.lastName  ?? fallbackLast,
              email:     session.user.email,
              phone:     person?.phone     ?? "",
              role:      session.user.role ?? null,
              poste:     person?.role?.labelFr ?? null,
              image:     resolvedImage,
            }}
            updateAction={updateProfil}
            changePasswordAction={changeOwnPassword}
          />
        </CardContent>
      </Card>
    </BureauContent>
  )
}
