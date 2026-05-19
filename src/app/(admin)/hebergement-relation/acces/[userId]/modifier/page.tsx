import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BureauContent } from "@/components/bureau/bureau-content"
import { getHerbergementRelationAccessForEdit } from "../../_services/get-herbergement-relation-access-list"
import { getHerbergementRelationRoles } from "../../_services/get-herbergement-relation-roles"
import { updateHerbergementRelationAccess } from "../../_actions/herbergement-relation-access-actions"
import { EditHerbergementRelationAccessForm } from "../../_components/edit-herbergement-relation-access-form"

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
    getHerbergementRelationAccessForEdit(userId),
    getHerbergementRelationRoles(),
  ])
  if (!data) notFound()

  const { user, person, profileKind } = data
  const personLabel = person ? `${person.firstName} ${person.lastName}` : null

  return (
    <BureauContent
      title="Modifier l'accès"
      description="Rôle, email de connexion et mot de passe."
      backHref="/hebergement-relation/acces"
    >
      <EditHerbergementRelationAccessForm
        defaultEmail={user.email}
        defaultRole={user.role ?? "PERMADMIN"}
        personLabel={personLabel}
        profileKind={profileKind}
        roles={roles}
        action={updateHerbergementRelationAccess.bind(null, userId)}
      />
    </BureauContent>
  )
}
