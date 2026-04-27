import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BureauContent } from "@/components/bureau/bureau-content"
import { Card, CardContent } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { UserForm } from "../../_components/user-form"
import { updateUser } from "../../_actions/actions"

export const metadata: Metadata = { title: "Modifier un utilisateur" }

export default async function ModifierUtilisateurPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user   = await prisma.user.findUnique({ where: { id } })
  if (!user) notFound()

  // Récupérer la Person liée (rôle GAM = Person.role)
  const person = await prisma.person.findUnique({
    where: { userId: id },
    include: { role: true },
  })
  // Fallback : décomposer user.name si aucune Person n'existe encore
  const nameParts = user.name.split(" ")
  const firstName = person?.firstName ?? (nameParts.slice(0, -1).join(" ") || user.name)
  const lastName  = person?.lastName  ?? (nameParts.slice(-1).join(" ") || "")

  return (
    <BureauContent
      title="Modifier l'utilisateur"
      description={`Modifier le compte de ${user.name}`}
    >
      <Card>
        <CardContent className="pt-6">
          <UserForm
            mode="edit"
            updateAction={updateUser.bind(null, user.id)}
            defaultValues={{
              firstName,
              lastName,
              email:       user.email,
              role:        user.role ?? "bureau",
              associationRoleCode: person?.role?.code ?? "",
              phone:       person?.phone ?? null,
              description: person?.description ?? null,
              showOnSite:  person?.showOnSite ?? true,
              imageUrl:    person?.image ?? user.image ?? null,
            }}
          />
        </CardContent>
      </Card>
    </BureauContent>
  )
}
