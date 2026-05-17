import type { Metadata } from "next"
import { BureauContent } from "@/components/bureau/bureau-content"
import { getEligiblePersonsForAccess } from "../_services/get-eligible-persons-for-access"
import { createDashboardAccess } from "../_actions/dashboard-access-actions"
import { CreateDashboardAccessForm } from "../_components/create-dashboard-access-form"

export const metadata: Metadata = {
  title: "Nouvel accès dashboard",
  description: "Créer un accès dashboard pour une personne existante",
}

export default async function NouvelAccesPage() {
  const persons = await getEligiblePersonsForAccess()

  return (
    <BureauContent
      title="Nouvel accès"
      description="Choisissez une personne sans compte, définissez son rôle et son mot de passe."
      backHref="/bureau/acces"
    >
      <CreateDashboardAccessForm persons={persons} action={createDashboardAccess} />
    </BureauContent>
  )
}
