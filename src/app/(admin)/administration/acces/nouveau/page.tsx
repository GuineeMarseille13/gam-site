import type { Metadata } from "next"
import { BureauContent } from "@/components/bureau/bureau-content"
import { getEligiblePersonsForAdministrationAccess } from "../_services/get-eligible-persons-for-administration-access"
import { getPermanenceAdminRoles } from "../_services/get-permanence-admin-roles"
import { createAdministrationAccess } from "../_actions/administration-access-actions"
import { CreateAdministrationAccessForm } from "../_components/create-administration-access-form"

export const metadata: Metadata = {
  title: "Nouvel accès administration",
  description: "Créer un accès permanence administrative pour une personne existante",
}

export default async function NouvelAccesAdministrationPage() {
  const [persons, roles] = await Promise.all([
    getEligiblePersonsForAdministrationAccess(),
    getPermanenceAdminRoles(),
  ])

  return (
    <BureauContent
      title="Nouvel accès"
      description="Choisissez une personne sans compte, définissez son rôle de permanence administrative et son mot de passe."
      backHref="/administration/acces"
    >
      <CreateAdministrationAccessForm persons={persons} roles={roles} action={createAdministrationAccess} />
    </BureauContent>
  )
}
