import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BureauDataPage } from "@/components/bureau/bureau-data-page"
import { Card, CardContent } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { UserForm } from "../../_components/user-form"

export const metadata: Metadata = { title: "Modifier un utilisateur" }

export default async function ModifierUtilisateurPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user   = await prisma.user.findUnique({ where: { id } })
  if (!user) notFound()

  // Récupérer la Person liée pour firstName / lastName / phone
  const person = await prisma.person.findUnique({ where: { userId: id } })

  // Fallback : décomposer user.name si aucune Person n'existe encore
  const nameParts = user.name.split(" ")
  const firstName = person?.firstName ?? (nameParts.slice(0, -1).join(" ") || user.name)
  const lastName  = person?.lastName  ?? (nameParts.slice(-1).join(" ") || "")

  return (
    <BureauDataPage
      title="Modifier l'utilisateur"
      description={`Modifier le compte de ${user.name}`}
    >
      <Card>
        <CardContent className="pt-6">
          <UserForm
            mode="edit"
            defaultValues={{
              userId:      user.id,
              firstName,
              lastName,
              email:       user.email,
              role:        user.role ?? "bureau",
              phone:       person?.phone ?? null,
              description: person?.description ?? null,
              showOnSite:  person?.showOnSite ?? true,
              imageUrl:    person?.image ?? user.image ?? null,
            }}
          />
        </CardContent>
      </Card>
    </BureauDataPage>
  )
}
