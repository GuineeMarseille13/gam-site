import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BureauDataPage } from "@/components/bureau/bureau-data-page"
import { Card, CardContent } from "@/components/ui/card"
import { listUsers } from "../../_actions/actions"
import { UserForm } from "../../_components/user-form"

export const metadata: Metadata = { title: "Modifier un utilisateur" }

export default async function ModifierUtilisateurPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const users = await listUsers()
  const user = users.find((u) => u.id === id)

  if (!user) notFound()

  return (
    <BureauDataPage
      title="Modifier l'utilisateur"
      description={`Modifier le compte de ${user.name}`}
    >
      <Card className="max-w-lg">
        <CardContent className="pt-6">
          <UserForm
            mode="edit"
            defaultValues={{
              userId: user.id,
              name: user.name,
              email: user.email,
              role: user.role ?? "bureau",
            }}
          />
        </CardContent>
      </Card>
    </BureauDataPage>
  )
}
