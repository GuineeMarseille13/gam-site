import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BureauContent } from "@/components/bureau/bureau-content"
import { getAdministrationAccessForEdit } from "../../../_services/get-administration-access-list"
import { updateAdministrationAccessUser } from "../../../_actions/administration-access-actions"
import { EditAdministrationAccessForm } from "./_components/edit-administration-access-form"

export const metadata: Metadata = {
  title: "Modifier un accès",
}

export default async function ModifierAccesAdministrationPage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params
  const data = await getAdministrationAccessForEdit(userId)
  if (!data) notFound()

  const { user, person } = data
  const parts = user.name.trim().split(/\s+/)
  const defaultFirstName = person?.firstName ?? parts[0] ?? ""
  const defaultLastName = person?.lastName ?? parts.slice(1).join(" ") ?? ""

  return (
    <BureauContent
      title="Modifier l’accès"
      description="Mettre à jour les coordonnées, la photo ou le mot de passe du compte."
      backHref="/administration/acces"
    >
      <EditAdministrationAccessForm
        defaultFirstName={defaultFirstName}
        defaultLastName={defaultLastName}
        defaultEmail={user.email}
        defaultPhone={person?.phone ?? ""}
        defaultDescription={person?.description ?? ""}
        defaultImageUrl={person?.image ?? null}
        action={updateAdministrationAccessUser.bind(null, userId)}
      />
    </BureauContent>
  )
}
