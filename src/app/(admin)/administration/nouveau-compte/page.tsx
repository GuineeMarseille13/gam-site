import { redirect } from "next/navigation"

/** Redirection vers le flux unifié « Accès administration ». */
export default function NouveauCompteAdministrationRedirectPage() {
  redirect("/administration/acces/nouveau")
}
