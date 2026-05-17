import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BureauContent } from "@/components/bureau/bureau-content"
import { getDashboardAccessForEdit } from "../../_services/get-dashboard-access-list"
import { updateDashboardAccess } from "../../_actions/dashboard-access-actions"
import { EditDashboardAccessForm } from "../../_components/edit-dashboard-access-form"

export const metadata: Metadata = {
  title: "Modifier un accès",
}

export default async function ModifierAccesPage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params
  const data = await getDashboardAccessForEdit(userId)
  if (!data) notFound()

  const { user, person, profileKind } = data
  const personLabel = person ? `${person.firstName} ${person.lastName}` : null

  return (
    <BureauContent
      title="Modifier l'accès"
      description="Rôle, email de connexion et mot de passe."
      backHref="/bureau/acces"
    >
      <EditDashboardAccessForm
        defaultEmail={user.email}
        defaultRole={user.role ?? "BUREAU"}
        personLabel={personLabel}
        profileKind={profileKind}
        action={updateDashboardAccess.bind(null, userId)}
      />
    </BureauContent>
  )
}
