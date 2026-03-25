import type { Metadata } from "next"
import { BureauDataPage } from "@/components/bureau/bureau-data-page"
import { AdministrationCreateAccountForm } from "../_components/create-administration-account-form"
import { createAdministrationAccount } from "../_actions/create-administration-account"

export const metadata: Metadata = {
  title: "Nouvel accès administration",
  description: "Créer un compte avec le rôle Administration",
}

export default function NouveauCompteAdministrationPage() {
  return (
    <BureauDataPage
      title="Nouvel accès administration"
      backHref="/administration/acces"
    >
      <AdministrationCreateAccountForm action={createAdministrationAccount} />
    </BureauDataPage>
  )
}
