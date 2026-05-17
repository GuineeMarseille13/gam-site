import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BureauContent } from "@/components/bureau/bureau-content"
import { getAdministrationAccessForEdit } from "../../_services/get-administration-access-list"
import { getPermanenceAdminRoles } from "../../_services/get-permanence-admin-roles"
import { updateAdministrationAccess } from "../../_actions/administration-access-actions"
import { EditAdministrationAccessForm } from "../../_components/edit-administration-access-form"

export const metadata: Metadata = {
  title: "Modifier un accès",
}

export default async function ModifierAccesAdministrationPage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params
  const [data, roles] = await Promise.all([
    getAdministrationAccessForEdit(userId),
    getPermanenceAdminRoles(),
  ])
  if (!data) notFound()

  const { user, person, profileKind } = data
  const personLabel = person ? `${person.firstName} ${person.lastName}` : null

  return (
    <BureauContent
      title="Modifier l'accès"
      description="Rôle, email de connexion et mot de passe."
      backHref="/administration/acces"
    >
      <EditAdministrationAccessForm
        defaultEmail={user.email}
        defaultRole={user.role ?? "PERMADMIN"}
        personLabel={personLabel}
        profileKind={profileKind}
        roles={roles}
        action={updateAdministrationAccess.bind(null, userId)}
      />
    </BureauContent>
  )
}
