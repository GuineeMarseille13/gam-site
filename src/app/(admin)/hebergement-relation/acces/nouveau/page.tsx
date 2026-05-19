import type { Metadata } from "next"
import { BureauContent } from "@/components/bureau/bureau-content"
import { getEligiblePersonsForHerbergementRelationAccess } from "../_services/get-eligible-persons-for-herbergement-access"
import { getHerbergementRelationRoles } from "../_services/get-herbergement-relation-roles"
import { createHerbergementRelationAccess } from "../_actions/herbergement-relation-access-actions"
import { CreateHerbergementRelationAccessForm } from "../_components/create-herbergement-relation-access-form"

export const metadata: Metadata = {
  title: "Nouvel accès hébergement",
  description: "Créer un accès hébergement et mise en relation pour une personne existante",
}

export default async function NouvelAccesAdministrationPage() {
  const [persons, roles] = await Promise.all([
    getEligiblePersonsForHerbergementRelationAccess(),
    getHerbergementRelationRoles(),
  ])

  return (
    <BureauContent
      title="Nouvel accès"
      description="Choisissez une personne sans compte, définissez son rôle de hébergement et mise en relation et son mot de passe."
      backHref="/hebergement-relation/acces"
    >
      <CreateHerbergementRelationAccessForm persons={persons} roles={roles} action={createHerbergementRelationAccess} />
    </BureauContent>
  )
}
